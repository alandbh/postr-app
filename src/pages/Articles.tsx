import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import { db, getAllTags, getRecentTags, type Article } from '@/db/schema'
import ArticleCard from '@/components/ArticleCard'
import SearchBar from '@/components/SearchBar'
import TagsDrawer from '@/components/TagsDrawer'

type Filter = {
  type: 'tag' | 'text'
  value: string
} | null

export default function Articles() {
  const [items, setItems] = useState<Article[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [recentTags, setRecentTags] = useState<string[]>([])
  const [filter, setFilter] = useState<Filter>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [visibleTagsCount, setVisibleTagsCount] = useState<number | null>(null)
  
  const tagsContainerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    db.articles.orderBy('savedAt').reverse().toArray().then(setItems)
    getAllTags().then(setAllTags)
    getRecentTags().then(setRecentTags)
  }, [])

  useLayoutEffect(() => {
    if (!measureRef.current || recentTags.length === 0) return
    
    const container = measureRef.current
    const children = Array.from(container.children) as HTMLElement[]
    if (children.length === 0) return
    
    const lineHeight = children[0]?.offsetHeight || 32
    const gap = 8
    const maxHeight = (lineHeight * 2) + gap + 4
    
    let totalWidth = 0
    const containerWidth = container.offsetWidth
    let lines = 1
    let count = 0
    
    for (let i = 0; i < children.length - 1; i++) {
      const child = children[i]
      const childWidth = child.offsetWidth + gap
      
      if (totalWidth + childWidth > containerWidth) {
        lines++
        totalWidth = childWidth
        if (lines > 2) break
      } else {
        totalWidth += childWidth
      }
      count++
    }
    
    setVisibleTagsCount(count)
  }, [recentTags])

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

  const displayedTags = visibleTagsCount !== null 
    ? recentTags.slice(0, visibleTagsCount) 
    : recentTags

  const hasMoreTags = allTags.length > displayedTags.length

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

      {recentTags.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-on-surface/70 mb-2">Minhas tags</h2>
          
          <div 
            ref={measureRef} 
            className="flex flex-wrap gap-2 absolute opacity-0 pointer-events-none"
            aria-hidden="true"
          >
            {recentTags.map(tag => (
              <span key={tag} className="text-sm px-3 py-1 rounded-full bg-primary/20">
                {tag}
              </span>
            ))}
            <span className="text-sm px-3 py-1 rounded-full border border-primary/30">
              Todas as tags...
            </span>
          </div>

          <div ref={tagsContainerRef} className="flex flex-wrap gap-2">
            {displayedTags.map(tag => (
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
            {hasMoreTags && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-sm px-3 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              >
                Todas as tags...
              </button>
            )}
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

      <TagsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        tags={allTags}
        selectedTag={filter?.type === 'tag' ? filter.value : undefined}
        onTagClick={handleTagClick}
      />
    </div>
  )
}
