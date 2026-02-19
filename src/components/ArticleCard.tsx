import React from 'react'
import { Link } from 'react-router-dom'
import type { Article } from '@/db/schema'

interface ArticleCardProps {
  article: Article
  onTagClick?: (tag: string) => void
}

export default function ArticleCard({ article, onTagClick }: ArticleCardProps) {
  return (
    <Link to={`/reader/${article.id}`} className="flex gap-4 group rounded-2xl border border-white/10 py-4 hover:border-white/20 overflow-hidden">
      <figure className="w-[100px] h-[110px] md:w-[200px] md:h-[120px] block rounded-lg overflow-hidden">
        <img src={article.image} alt={article.title || article.url} className="w-full h-full object-cover" />
      </figure>

      <div className="flex-1 min-w-0 md:pt-4">
        <div className="text-xs dark:text-white/60 mb-1">
          {article.savedAt ? new Date(article.savedAt).toLocaleString('pt-BR', { dateStyle: 'medium' }) : ''}
        </div>

        <h3 className="text-sm md:text-lg text-primary font-semibold group-hover:underline line-clamp-3 md:line-clamp-none">{article.title || article.url}</h3>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
              {article.tags.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => {
                    if (onTagClick) {
                      e.preventDefault()
                      e.stopPropagation()
                      onTagClick(t)
                    }
                  }}
                  className={`shrink-0 text-xs px-3 py-1 rounded-full font-sans bg-primary/20 text-primary ${
                    onTagClick ? 'hover:bg-primary/30 cursor-pointer' : ''
                  }`}
                >
                  {t}
                </button>
              ))}
          </div>
        )}
      </div>
    </Link>
  )
}
