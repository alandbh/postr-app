import React, { useState } from 'react'
import BottomSheet from '@/components/BottomSheet'
import TagModal from '@/components/TagModal'

interface TagsBottomSheetProps {
  articleId: string
  articleTitle: string
  onClose: () => void
}

export default function TagsBottomSheet({ articleId, articleTitle, onClose }: TagsBottomSheetProps) {
  const [showTagModal, setShowTagModal] = useState(false)

  function handleAddTags() {
    setShowTagModal(true)
  }

  function handleTagModalClose() {
    setShowTagModal(false)
    onClose()
  }

  return (
    <>
      <BottomSheet open={!showTagModal} onClose={onClose}>
        <h2 className="text-lg font-bold text-on-surface mb-1 w-64 md:w-full">
          Adicione tags (etiquetas) a este artigo.
        </h2>
        <p className="text-sm md:text-base text-on-surface/60 mb-10">
          Assim fica mais fácil encontrá-lo depois. 😎
        </p>

        <button
          onClick={handleAddTags}
          className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-sm hover:opacity-90 transition-opacity mb-3"
        >
          Adicionar tags
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm text-on-surface/60 hover:text-on-surface transition-colors"
        >
          Não, obrigado
        </button>
      </BottomSheet>

      {showTagModal && (
        <TagModal
          articleId={articleId}
          articleTitle={articleTitle}
          onClose={handleTagModalClose}
        />
      )}
    </>
  )
}
