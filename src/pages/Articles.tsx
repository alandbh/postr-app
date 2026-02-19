import React, { useEffect, useState, useMemo } from 'react'
import { db, getAllTags, type Article } from '@/db/schema'
import ArticleCard from '@/components/ArticleCard'
import SearchBar from '@/components/SearchBar'

type Filter = {
  type: 'tag' | 'text'
  value: string
} | null

export default function Articles() {
  const [items, setItems] = useState<Article[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [filter, setFilter] = useState<Filter>(null)

  useEffect(() => {
    db.articles.orderBy('savedAt').reverse().toArray().then(setItems)
    getAllTags().then(setAllTags)
  }, [])

  const filteredArticles = useMemo(() => {
    if (!filter) return items
    if (filter.type === 'tag') {
      return items.filter(a => a.tags?.includes(filter.value))
    }
    const search = filter.value.toLowerCase()
    return items.filter(a => 
      a.title?.toLowerCase().includes(search) ||
      a.excerpt?.toLowerCase().includes(search)
    )
  }, [items, filter])

  function handleTagClick(tag: string) {
    setFilter({ type: 'tag', value: tag })
  }

  function handleSearch(text: string) {
    setFilter({ type: 'text', value: text })
  }

  function clearFilter() {
    setFilter(null)
  }

  if (items.length === 0) {
    return <div className="opacity-70">Nenhum artigo salvo ainda.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Meus artigos</h1>

      <SearchBar
        articles={items}
        onSearch={handleSearch}
        value={filter?.type === 'text' ? filter.value : ''}
        onClear={clearFilter}
      />

      {allTags.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-on-surface/70 mb-2">Minhas tags</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  filter?.type === 'tag' && filter.value === tag
                    ? 'bg-primary text-on-primary-contrast'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {filter && (
        <div className="flex items-center gap-2 text-sm text-on-surface/80">
          <span>
            {filter.type === 'tag' 
              ? `Artigos com a tag: "${filter.value}"`
              : `Artigos contendo: "${filter.value}"`
            }
          </span>
          <button
            onClick={clearFilter}
            className="ml-2 text-primary hover:text-primary/80 underline"
            aria-label="Limpar filtro"
          >
            Limpar
          </button>
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <div className="opacity-70 py-8 text-center">
          Nenhum artigo encontrado para este filtro.
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredArticles.map(a => (
            <ArticleCard 
              key={a.id} 
              article={a} 
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
