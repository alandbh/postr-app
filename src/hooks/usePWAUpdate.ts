import { useState, useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'
import { scheduleUpdateCheck, shouldForceUpdate } from '../utils/pwaConfig'

interface UpdateAvailableEvent {
  needRefresh: boolean
  offlineReady: boolean
}

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const updateSW = registerSW({
        onNeedRefresh() {
          setUpdateAvailable(true)
          // Se for horário de atualização forçada, atualizar automaticamente
          if (shouldForceUpdate()) {
            updateSW(true)
          }
        },
        onOfflineReady() {
          setOfflineReady(true)
        },
        onRegistered(registration) {
          console.log('SW Registered:', registration)
          // Iniciar verificação periódica de atualizações
          scheduleUpdateCheck()
        },
        onRegisterError(error) {
          console.log('SW registration error', error)
        }
      })

      // Expor função de atualização globalmente
      window.updatePWA = () => {
        setIsUpdating(true)
        updateSW(true)
      }
    }
  }, [])

  const updateApp = () => {
    if (window.updatePWA) {
      window.updatePWA()
    }
  }

  const dismissUpdate = () => {
    setUpdateAvailable(false)
  }

  return {
    updateAvailable,
    offlineReady,
    isUpdating,
    updateApp,
    dismissUpdate
  }
}

// Declaração global para TypeScript
declare global {
  interface Window {
    updatePWA: () => void
  }
}
