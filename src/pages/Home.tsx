import React, { useState } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { db } from '@/db/schema'
import { parseArticleFromUrl } from '@/lib/parser'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSave() {
    if (!url) return
    setLoading(true)
    try {
      const id = crypto.randomUUID()
      const parsed = await parseArticleFromUrl(url)
      await db.articles.add({
        id,
        url,
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
      <pre>v1.0.2</pre>
    </div>
  )
}
