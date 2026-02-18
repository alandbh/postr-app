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

        <h3 className="text-sm md:text-lg text-primary font-semibold group-hover:underline line-clamp-3 md:line-clamp-none">{article.title || article.url}</h3>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
              {article.tags.map(t => (
                <span key={t} className="inline-flex text-nowrap items-center gap-1 text-xs px-3 py-1 rounded-full font-sans bg-primary/20 text-primary">{t}</span>
              ))}
          </div>
        )}
      </div>
    </Link>
  )
}
