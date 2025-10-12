import React, { useState } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { db } from '@/db/schema'
import { parseArticleFromUrl } from '@/lib/parser'

// Função para extrair URL de texto compartilhado
function extractUrlFromText(text: string): string | null {
  // Regex para encontrar URLs (http/https)
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex)
  
  if (matches && matches.length > 0) {
    // Retorna a primeira URL encontrada
    return matches[0]
  }
  
  return null
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSave() {
    if (!url) return
    setLoading(true)
    try {
      // Extrair URL do texto colado
      let cleanUrl = url.trim()
      
      // Se não começa com http, tentar extrair URL do texto
      if (!cleanUrl.startsWith('http')) {
        const extractedUrl = extractUrlFromText(cleanUrl)
        if (extractedUrl) {
          cleanUrl = extractedUrl
          // Atualizar o campo com a URL limpa
          setUrl(cleanUrl)
        } else {
          setLoading(false)
          alert('Nenhuma URL válida encontrada no texto colado')
          return
        }
      }
      
      const id = crypto.randomUUID()
      const parsed = await parseArticleFromUrl(cleanUrl)
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
      window.location.href = `/reader/${id}`
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans">
      

      {/* Hero central */}
      <main className="mx-auto max-w-3xl px-6 pt-6 pb-16 text-center mt-10">
        <div className="flex flex-col items-center justify-center gap-5">
        <img src="/icons/logo-postr.svg" alt="Postr" className="mx-auto h-16 mb-6" />
        <p className="mx-auto max-w-2xl text-headline font-medium">
          Salve artigos, posts e notícias para ler depois…{' '}
          <a href="/about" className="text-primary underline decoration-primary-fixed underline-offset-4 hover:decoration-primary">
            sem distrações!
          </a>
        </p>
    </div>
        {/* Campo + botão */}
        <div className="mt-16 flex flex-col  gap-3">
          <div className="w-full max-w-2xl flex items-center gap-3">
            <Input
              placeholder="https://"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSave()}
              className="h-12 rounded-full border-2 border-primary/30 focus:border-primary"
              aria-label="Cole a URL do artigo aqui"
            />
          <Button
            onClick={onSave}
            disabled={!url}
            isLoading={loading}
            className="h-12 px-6 rounded-full bg-primary text-on-primary-contrast hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary-fixed"
          >
            SALVAR
          </Button>
          </div>
            <div className="mt-2 text-sm text-on-surface/80 text-left">Cole a URL do artigo aqui</div>

        </div>
      </main>
    </div>
  )
}
