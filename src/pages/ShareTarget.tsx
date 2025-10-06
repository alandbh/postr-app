import React, { useEffect, useState } from 'react'
import { db } from '@/db/schema'
import { parseArticleFromUrl } from '@/lib/parser'

// Recebe POST share_target (urlencoded). Vite em dev não lida com POST de fora,
// mas em build (PWA) o navegador entrega para esta rota com params na URL (?title=&text=&url=).
export default function ShareTarget() {
  const [status, setStatus] = useState('Processando...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processSharedUrl = async () => {
      try {
        const sp = new URLSearchParams(location.search)
        const url = sp.get('url')

        console.log('URL compartilhada:', url)

        if (!url) {
          setError('Nenhuma URL foi compartilhada')
          return
        }

        // Limpar e validar a URL
        const cleanUrl = url.trim()
        
        // Verificar se é uma URL válida
        try {
          new URL(cleanUrl)
        } catch {
          setError('URL inválida: ' + cleanUrl)
          return
        }

        setStatus('Extraindo conteúdo...')
        
        // Usar exatamente a mesma lógica da Home.tsx
        const id = crypto.randomUUID()
        const parsed = await parseArticleFromUrl(cleanUrl)
        
        setStatus('Salvando artigo...')
        
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
        
        setStatus('Redirecionando...')
        window.location.href = `/reader/${id}`
        
      } catch (err) {
        console.error('Erro ao processar compartilhamento:', err)
        setError('Erro ao processar o artigo: ' + (err as Error).message)
      }
    }

    processSharedUrl()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-900 text-white">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Erro</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => location.replace('/')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-900 text-white">
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-300">{status}</p>
      </div>
    </div>
  )
}
