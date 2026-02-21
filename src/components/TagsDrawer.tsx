import React, { useMemo, Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

interface TagsDrawerProps {
  isOpen: boolean
  onClose: () => void
  tags: string[]
  selectedTag?: string
  onTagClick: (tag: string) => void
}

export default function TagsDrawer({ isOpen, onClose, tags, selectedTag, onTagClick }: TagsDrawerProps) {
  const groupedTags = useMemo(() => {
    const groups: Record<string, string[]> = {}
    for (const tag of tags) {
      const letter = tag[0]?.toUpperCase() || '#'
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(tag)
    }
    return groups
  }, [tags])

  const sortedLetters = Object.keys(groupedTags).sort()

  function handleTagClick(tag: string) {
    onTagClick(tag)
    onClose()
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex justify-end">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="w-full max-w-sm bg-surface shadow-xl flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-primary/10">
                <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Minhas tags
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                  aria-label="Fechar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {sortedLetters.map(letter => (
                  <div key={letter} className="mb-6">
                    <h3 className="text-sm font-semibold text-on-surface/60 mb-2">{letter}</h3>
                    <div className="flex flex-wrap gap-2">
                      {groupedTags[letter].map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`text-sm px-3 py-1 rounded-full transition-colors ${
                            selectedTag === tag
                              ? 'bg-primary text-on-primary-contrast'
                              : 'bg-primary/20 text-primary hover:bg-primary/30'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {tags.length === 0 && (
                  <div className="text-center text-on-surface/60 py-8">
                    Nenhuma tag registrada ainda.
                  </div>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
