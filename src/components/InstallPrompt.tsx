import React, { useEffect, useState, useRef } from 'react'
import Button from '@/components/Button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'pwaPromptSkippedAt'
const COOLDOWN_DAYS = 7

function shouldShowPrompt(): boolean {
  const skippedAt = localStorage.getItem(STORAGE_KEY)
  if (!skippedAt) return true
  
  const skippedDate = parseInt(skippedAt, 10)
  const daysSinceSkipped = (Date.now() - skippedDate) / (1000 * 60 * 60 * 24)
  return daysSinceSkipped >= COOLDOWN_DAYS
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      promptRef.current = event
      setDeferredPrompt(event)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolled])

  useEffect(() => {
    if (deferredPrompt && hasScrolled && shouldShowPrompt()) {
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [deferredPrompt, hasScrolled])

  async function handleInstall() {
    if (!promptRef.current) return
    
    await promptRef.current.prompt()
    const { outcome } = await promptRef.current.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
    setIsVisible(false)
  }

  function handleSkip() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-on-surface/10 shadow-lg px-4 py-4 animate-slide-up"
      style={{ 
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <h2 className="text-xl font-bold text-on-surface mb-4 w-full">
          Adicione o atalho do Postr na tela inicial
        </h2>
        <p className="md:text-base text-on-surface/60 mb-10">
          Assim você pode compartilhar qualquer notícia com o Postr e ler depois...
          <span className="text-nowrap font-bold">sem distrações. 😎</span>
        </p>
        <div className="flex flex-col gap-4">
          <Button variant="primary" full onClick={handleInstall}>
            Adicionar
          </Button>
          <Button variant="ghost" full onClick={handleSkip}>
            Não, obrigado
          </Button>
        </div>
      </div>
    </div>
  )
}
