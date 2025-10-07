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
      window.location.href = `/postr/reader/${id}`
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold max-w-prose">Salve artigos, posts e notícias para ler depois… sem distrações!</div>
      <div className="flex gap-2">
        <Input
          placeholder="Cole a URL do artigo aqui"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave()}
        />
        <Button onClick={onSave} disabled={!url} isLoading={loading}>Salvar</Button>
      </div>
      <div className="text-sm text-white/60">
        <a href="/articles" className="underline">Meus artigos</a> · <a href="/account" className="underline">Minha conta</a>
      </div>
      <pre>
        v1.0.8
        Logs na tela v3
      </pre>
    </div>
  )
}
