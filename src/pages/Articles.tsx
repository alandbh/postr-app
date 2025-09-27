import React, { useEffect, useState } from 'react'
import { db, type Article } from '@/db/schema'
import ArticleCard from '@/components/ArticleCard'

export default function Articles() {
  const [items, setItems] = useState<Article[]>([])

  useEffect(() => {
    db.articles.orderBy('savedAt').reverse().toArray().then(setItems)
  }, [])

  if (items.length === 0) {
    return <div className="opacity-70">Nenhum artigo salvo ainda.</div>
  }

  return (
    <div className="grid gap-3">
      {items.map(a => <ArticleCard key={a.id} article={a} />)}
    </div>
  )
}
