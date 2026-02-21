import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import TagModal from '@/components/TagModal'

interface TagsBottomSheetProps {
  articleId: string
  articleTitle: string
  onClose: () => void
}

export default function TagsBottomSheet({ articleId, articleTitle, onClose }: TagsBottomSheetProps) {
  const [showTagModal, setShowTagModal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 120)
    return () => clearTimeout(timer)
  }, [])

  function handleClose() {
    setIsVisible(false)
    setTimeout(onClose, 250)
  }

  function handleAddTags() {
    setShowTagModal(true)
  }

  function handleTagModalClose() {
    setShowTagModal(false)
    onClose()
  }

  return (
    <>
      <Transition show={isVisible && !showTagModal} as={Fragment}>
        <Dialog onClose={handleClose} className="relative z-40">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-end">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <DialogPanel className="w-full md:max-w-xl mx-auto bg-surface rounded-t-2xl shadow-xl px-6 pt-6 pb-10">
                <div className="flex justify-center mb-8">
                  <div className="w-10 h-1 rounded-full bg-on-surface/20" />
                </div>

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
                  onClick={handleClose}
                  className="w-full py-3 text-sm text-on-surface/60 hover:text-on-surface transition-colors"
                >
                  Não, obrigado
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

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
