import React from 'react'
import BottomSheet from '@/components/BottomSheet'
import Button from './Button'

interface ShareBottomSheetProps {
  open: boolean
  onClose: () => void
  articleTitle: string
  articleUrl: string
}

export default function ShareBottomSheet({ open, onClose, articleTitle, articleUrl }: ShareBottomSheetProps) {
  async function handleSharePostr() {
    const postrUrl = `${window.location.origin}/read?url=${encodeURIComponent(articleUrl)}`
    if (navigator.share) {
      await navigator.share({
        title: articleTitle,
        text: `Leia "${articleTitle}" no Postr`,
        url: postrUrl
      })
    } else {
      await navigator.clipboard.writeText(postrUrl)
      alert('Link do Postr copiado!')
    }
    onClose()
  }

  async function handleShareOriginal() {
    if (navigator.share) {
      await navigator.share({ title: articleTitle, url: articleUrl })
    } else {
      await navigator.clipboard.writeText(articleUrl)
      alert('Link copiado!')
    }
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-on-surface mb-1">
        Como quer compartilhar este artigo?
      </h2>
      <p className="text-sm md:text-base text-on-surface/60 mb-10">
        Você pode compartilhar o artigo formatado com o Postr ou o link original
      </p>
      </div>

      <div className="flex flex-col gap-4">

      {/* <button
        onClick={handleSharePostr}
        className="w-full py-3.5 rounded-xl bg-primary text-surface font-semibold text-sm hover:opacity-90 transition-opacity mb-3"
      >
        Compartilhar link do Postr
      </button> */}
      <Button variant="primary" full onClick={handleSharePostr}>Compartilhar link do Postr</Button>

      {/* <button
        onClick={handleShareOriginal}
        className="w-full py-3 text-sm text-on-surface/60 hover:text-on-surface transition-colors"
        >
        Compartilhar link original
        </button> */}
      <Button variant="ghost" full onClick={handleShareOriginal}>Compartilhar link original</Button>
        </div>
    </BottomSheet>
  )
}
