import React, { useEffect, useState } from 'react'
import TagInput from './TagInput'
import Button from './Button'
import { getAllTags, db } from '@/db/schema'

interface TagModalProps {
  articleId: string
  articleTitle: string
  initialTags?: string[]
  onClose: () => void
}

export default function TagModal({ articleId, articleTitle, initialTags = [], onClose }: TagModalProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getAllTags().then(setSuggestions)
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await db.articles.update(articleId, { tags })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function handleSkip() {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start pt-12 md:items-center md:pt-0 justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl w-full max-w-full md:max-w-xl p-6 shadow-xl">
        {/* <h2 className="text-xl font-bold text-on-surface mb-2">Adicionar Tags</h2> */}
        <span className='text-sm text-on-surface/70 mb-4'>ARTIGO:</span>
        <h1 className="text-on-surface/70 mb-4 line-clamp-2 font-serif font-bold text-xl md:text-article-h1">
          {articleTitle}
        </h1>

        <div className="mb-6">
          <TagInput
            value={tags}
            onChange={setTags}
            suggestions={suggestions}
            placeholder="Digite uma tag..."
            onSubmit={handleSave}
          />
          <p className="text-xs text-on-surface/50 mt-2">
            Adicione tags (separadas por vírgula) para organizar seus artigos.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleSkip}
            className="px-4 py-2 text-on-surface/70 hover:text-on-surface"
          >
            Pular
          </Button>
          <Button
            onClick={handleSave}
            isLoading={saving}
            disabled={saving}
            className="px-6 py-2 bg-primary text-on-primary-contrast hover:bg-primary/90 rounded-lg"
          >
            Salvar Tags
          </Button>
        </div>
      </div>
    </div>
  )
}
