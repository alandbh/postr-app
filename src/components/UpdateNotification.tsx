import React from 'react'
import { usePWAUpdate } from '../hooks/usePWAUpdate'
import Button from './Button'

export default function UpdateNotification() {
  const { updateAvailable, offlineReady, isUpdating, updateApp, dismissUpdate } = usePWAUpdate()

  if (!updateAvailable && !offlineReady) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-brand-800 border border-brand-600 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">
            {updateAvailable ? 'Nova versão disponível!' : 'App pronto para uso offline'}
          </h3>
          <p className="text-sm text-gray-300">
            {updateAvailable 
              ? 'Uma nova versão do Postr está disponível. Atualize para ter as últimas melhorias.'
              : 'O Postr agora funciona offline. Você pode ler seus artigos mesmo sem internet.'
            }
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          {updateAvailable && (
            <>
              <Button
                onClick={updateApp}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
              >
                {isUpdating ? 'Atualizando...' : 'Atualizar'}
              </Button>
              <Button
                onClick={dismissUpdate}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-sm"
              >
                Depois
              </Button>
            </>
          )}
          {offlineReady && !updateAvailable && (
            <Button
              onClick={dismissUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
            >
              Entendi
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
