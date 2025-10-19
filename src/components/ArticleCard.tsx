import React from 'react'
import { Link } from 'react-router-dom'
import type { Article } from '@/db/schema'

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/reader/${article.id}`} className="flex gap-4 group rounded-2xl border border-white/10 py-4 hover:border-white/20">
      <figure className="w-[100px] h-[80px] md:w-[200px] md:h-[120px] block rounded-lg overflow-hidden">
        <img src={article.image} alt={article.title || article.url} className="w-full h-full object-cover" />
      </figure>

      <div className="flex-1 md:pt-4">
        <div className="text-xs dark:text-white/60 mb-1">
          {article.savedAt ? new Date(article.savedAt).toLocaleString('pt-BR', { dateStyle: 'medium' }) : ''}
        </div>

        <h3 className="text-sm md:text-lg text-primary font-semibold group-hover:underline">{article.title || article.url}</h3>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {article.tags.map(t => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
