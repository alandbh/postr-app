import React, { useState, useRef, useEffect, useMemo } from 'react'
import type { Article } from '@/db/schema'

interface SearchBarProps {
  articles: Article[]
  onSearch: (text: string) => void
  value: string
  onClear: () => void
  placeholder?: string
}

interface Suggestion {
  text: string
  article: Article
}

export default function SearchBar({ 
  articles, 
  onSearch, 
  value, 
  onClear,
  placeholder = 'Buscar artigos...' 
}: SearchBarProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setInput(value)
    }
  }, [value])

  const suggestions = useMemo((): Suggestion[] => {
    if (!input.trim()) return []
    
    const search = input.toLowerCase()
    const results: Suggestion[] = []
    const seen = new Set<string>()
    
    for (const article of articles) {
      if (results.length >= 5) break
      
      const title = article.title || ''
      const excerpt = article.excerpt || ''
      
      if (title.toLowerCase().includes(search)) {
        const key = title.toLowerCase()
        if (!seen.has(key)) {
          seen.add(key)
          results.push({ text: title, article })
        }
      } else if (excerpt.toLowerCase().includes(search)) {
        const snippetStart = Math.max(0, excerpt.toLowerCase().indexOf(search) - 20)
        const snippet = excerpt.slice(snippetStart, snippetStart + 60)
        const key = snippet.toLowerCase()
        if (!seen.has(key)) {
          seen.add(key)
          results.push({ text: snippet + '...', article })
        }
      }
    }
    
    return results
  }, [articles, input])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectSuggestion(suggestion: Suggestion) {
    setInput(suggestion.text.replace(/\.\.\.$/,''))
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    onSearch(suggestion.text.replace(/\.\.\.$/,''))
  }

  function handleSubmit() {
    if (input.trim()) {
      onSearch(input.trim())
      setShowSuggestions(false)
    }
  }

  function handleClear() {
    setInput('')
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    onClear()
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        selectSuggestion(suggestions[highlightedIndex])
      } else {
        handleSubmit()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setShowSuggestions(true)
            setHighlightedIndex(-1)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-12 px-4 pr-10 rounded-lg bg-surface border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface placeholder-on-surface/60"
          aria-label="Campo de busca"
        />
        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/60 hover:text-on-surface focus:outline-none"
            aria-label="Limpar busca"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && input && (
        <ul className="absolute z-10 w-full mt-1 bg-surface border border-primary/20 rounded-lg shadow-lg max-h-64 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.article.id}-${index}`}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-4 py-3 cursor-pointer ${
                index === highlightedIndex 
                  ? 'bg-primary/20 text-primary' 
                  : 'hover:bg-primary/10'
              }`}
            >
              <span className="line-clamp-1">{suggestion.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
