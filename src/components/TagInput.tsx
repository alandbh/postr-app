import React, { useState, useRef, useEffect } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
  placeholder?: string
  onSubmit?: () => void
}

export default function TagInput({ value, onChange, suggestions, placeholder = 'Adicionar tag...', onSubmit }: TagInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function addTag(tag: string) {
    const normalized = tag.trim().toLowerCase()
    if (normalized && !value.includes(normalized)) {
      onChange([...value, normalized])
    }
    setInput('')
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onChange(value.filter(t => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === ',') {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        addTag(filteredSuggestions[highlightedIndex])
      } else if (input.trim()) {
        addTag(input.replace(/,/g, ''))
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (input.trim()) {
        addTag(input)
      }
      onSubmit?.()
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
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
      <div 
        className="flex flex-wrap gap-2 p-3 rounded-lg bg-surface border border-primary/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 min-h-[48px]"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(tag => (
          <span 
            key={tag} 
            className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-primary/20 text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="ml-1 hover:text-red-400 focus:outline-none"
              aria-label={`Remover tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => {
            const val = e.target.value
            if (val.includes(',')) {
              const parts = val.split(',')
              parts.slice(0, -1).forEach(p => {
                const tag = p.trim()
                if (tag) addTag(tag)
              })
              setInput(parts[parts.length - 1])
            } else {
              setInput(val)
            }
            setShowSuggestions(true)
            setHighlightedIndex(-1)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-on-surface placeholder-on-surface/60"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && input && (
        <ul className="absolute z-10 w-full mt-1 bg-surface border border-primary/20 rounded-lg shadow-lg max-h-48 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => addTag(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-4 py-2 cursor-pointer ${
                index === highlightedIndex 
                  ? 'bg-primary/20 text-primary' 
                  : 'hover:bg-primary/10'
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
