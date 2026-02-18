import React, { useEffect, useState } from 'react'
import { db } from '@/db/schema'
import { parseArticleFromUrl } from '@/lib/parser'
import TagModal from '@/components/TagModal'

// Recebe POST share_target (urlencoded). Vite em dev não lida com POST de fora,
// mas em build (PWA) o navegador entrega para esta rota com params na URL (?title=&text=&url=).
// Domínios de serviços intermediários de compartilhamento (não são o artigo real)
const SHARE_SERVICE_DOMAINS = ['share.google', 'search.app', 't.co', 'bit.ly', 'goo.gl', 'tinyurl.com', 'ow.ly']

// Função para extrair URL de texto compartilhado.
// Quando há múltiplas URLs, prioriza a que NÃO é de um serviço de share.
function extractUrlFromText(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex)
  
  if (!matches || matches.length === 0) return null
  if (matches.length === 1) return matches[0]

  // Preferir URLs que não sejam de serviços intermediários
  const realUrl = matches.find(u => {
    try {
      const host = new URL(u).hostname.replace(/^www\./, '')
      return !SHARE_SERVICE_DOMAINS.some(d => host === d || host.endsWith('.' + d))
    } catch { return false }
  })

  return realUrl || matches[0]
}

export default function ShareTarget() {
  const [status, setStatus] = useState('Processando...')
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [savedArticle, setSavedArticle] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    const processSharedUrl = async () => {
      try {
        const sp = new URLSearchParams(location.search)
        const url = sp.get('url')
        const text = sp.get('text')
        const title = sp.get('title')

        // Debug: Mostrar dados recebidos
        setDebugInfo(prev => [...prev, `URL recebida: "${url || 'null'}"`])
        setDebugInfo(prev => [...prev, `Text recebido: "${text || 'null'}"`])
        setDebugInfo(prev => [...prev, `Title recebido: "${title || 'null'}"`])
        setDebugInfo(prev => [...prev, `URL completa: "${location.href}"`])
        // Detectar método real (POST vs GET)
        const isPost = document.referrer === '' && location.search === ''
        const method = isPost ? 'POST' : 'GET'
        setDebugInfo(prev => [...prev, `Método detectado: ${method}`])
        setDebugInfo(prev => [...prev, `Document referrer: "${document.referrer}"`])
        
        // Verificar se é um POST real do Share Target API
        if (isPost && !url && !text && !title) {
          setDebugInfo(prev => [...prev, 'AVISO: POST detectado mas sem parâmetros - possível problema no cPanel'])
          setDebugInfo(prev => [...prev, 'Tentando ler dados do body do POST...'])
          
          // Tentar ler dados do body (se disponível)
          try {
            const body = document.body.innerHTML
            setDebugInfo(prev => [...prev, `Body content: "${body.substring(0, 200)}..."`])
          } catch (e) {
            setDebugInfo(prev => [...prev, `Erro ao ler body: ${e}`])
          }
        }
        setDebugInfo(prev => [...prev, `Search params: "${location.search}"`])

        console.log('Dados compartilhados:', { url, text })

        // Tentar extrair URL de qualquer parâmetro disponível
        let extractedUrl = null
        let sourceParam = ''
        
        // Primeiro, verificar se há parâmetros na URL (GET)
        if (url || text || title) {
          setDebugInfo(prev => [...prev, 'Parâmetros encontrados na URL (GET)'])
        }
        
        if (url) {
          setDebugInfo(prev => [...prev, 'Tentando extrair URL do parâmetro "url"...'])
          extractedUrl = extractUrlFromText(url)
          if (extractedUrl) {
            sourceParam = 'url'
            setDebugInfo(prev => [...prev, `URL extraída do "url": "${extractedUrl}"`])
          }
        }
        
        if (!extractedUrl && text) {
          setDebugInfo(prev => [...prev, 'Tentando extrair URL do parâmetro "text"...'])
          extractedUrl = extractUrlFromText(text)
          if (extractedUrl) {
            sourceParam = 'text'
            setDebugInfo(prev => [...prev, `URL extraída do "text": "${extractedUrl}"`])
          }
        }
        
        if (!extractedUrl && title) {
          setDebugInfo(prev => [...prev, 'Tentando extrair URL do parâmetro "title"...'])
          extractedUrl = extractUrlFromText(title)
          if (extractedUrl) {
            sourceParam = 'title'
            setDebugInfo(prev => [...prev, `URL extraída do "title": "${extractedUrl}"`])
          }
        }
        
        if (!extractedUrl) {
          // Fallback: Tentar extrair URL da própria URL da página (para casos onde o cPanel não processa POST)
          setDebugInfo(prev => [...prev, 'Tentando fallback: extrair URL da própria URL da página...'])
          const currentUrl = location.href
          const fallbackUrl = extractUrlFromText(currentUrl)
          
          // Verificar se a URL extraída não é a própria URL do share-target
          if (fallbackUrl && !fallbackUrl.includes('/share-target')) {
            setDebugInfo(prev => [...prev, `URL extraída da URL da página: "${fallbackUrl}"`])
            extractedUrl = fallbackUrl
            sourceParam = 'url_da_pagina'
          } else {
            setError('Nenhuma URL válida encontrada nos parâmetros compartilhados')
            setDebugInfo(prev => [...prev, 'ERRO: Nenhuma URL encontrada em nenhum parâmetro'])
            setDebugInfo(prev => [...prev, 'DICA: Para testar manualmente, use: https://postr.alanvasconcelos.net/share-target?url=SUA_URL_AQUI'])
            setDebugInfo(prev => [...prev, 'DICA: Ou simplesmente use a página inicial do Postr para colar a URL'])
            return
          }
        }
        
        // Continuar o processo com a URL extraída
        const cleanUrl = extractedUrl
        setDebugInfo(prev => [...prev, `URL válida confirmada: "${cleanUrl}" (fonte: ${sourceParam})`])
        
        setStatus('Extraindo conteúdo...')
        setDebugInfo(prev => [...prev, 'Iniciando extração de conteúdo...'])
        
        const id = crypto.randomUUID()
        setDebugInfo(prev => [...prev, `ID gerado: ${id}`])
        
        try {
          const parsed = await parseArticleFromUrl(cleanUrl)
          setDebugInfo(prev => [...prev, `Conteúdo extraído: título="${parsed.title}", autor="${parsed.author}"`])
          
          setStatus('Salvando artigo...')
          setDebugInfo(prev => [...prev, 'Salvando no banco de dados...'])
          
          await db.articles.add({
            id,
            url: cleanUrl,
            title: parsed.title,
            content: parsed.content,
            excerpt: parsed.excerpt,
            author: parsed.author,
            image: parsed.image,
            tags: [],
            savedAt: Date.now()
          })
          
          setDebugInfo(prev => [...prev, 'Artigo salvo com sucesso!'])
          setStatus('Artigo salvo!')
          setSavedArticle({ id, title: parsed.title || cleanUrl })
          return
        } catch (parseError) {
          setDebugInfo(prev => [...prev, `ERRO no parsing: ${parseError}`])
          throw parseError
        }
        
      } catch (err) {
        console.error('Erro ao processar compartilhamento:', err)
        setError('Erro ao processar o artigo: ' + (err as Error).message)
      }
    }

    processSharedUrl()
  }, [])

  // Sempre mostrar a interface de debug, mesmo com erro

  return (
    <div className="min-h-screen bg-brand-900 text-white p-4 overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Postr - Debug Share Target</h1>
        
        {/* Status */}
        <div className="bg-brand-800 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">Status:</h2>
          <div className="flex items-center gap-2">
            {!savedArticle && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            <p className="text-gray-300">{status}</p>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
            <div className="space-y-1 text-sm">
              {debugInfo.map((info, index) => (
                <div key={index} className="text-gray-300 font-mono break-all">
                  {index + 1}. {info}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-800 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2 text-red-400">Erro:</h2>
            <p className="text-gray-300">{error}</p>
            <button 
              onClick={() => location.replace('/')}
              className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Voltar ao início
            </button>
          </div>
        )}
      </div>

      {savedArticle && (
        <TagModal
          articleId={savedArticle.id}
          articleTitle={savedArticle.title}
          onClose={() => {
            window.location.href = `/reader/${savedArticle.id}`
          }}
        />
      )}
    </div>
  )
}
