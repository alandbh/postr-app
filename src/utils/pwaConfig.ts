// Configurações avançadas para PWA
export const PWA_CONFIG = {
  // Estratégia de atualização
  updateStrategy: 'auto' as 'auto' | 'prompt' | 'manual',
  
  // Intervalo para verificar atualizações (em minutos)
  checkUpdateInterval: 5,
  
  // Forçar atualização em horários específicos
  forceUpdateTimes: ['09:00', '18:00'],
  
  // Configurações de cache
  cacheStrategy: {
    // Tempo de vida do cache (em dias)
    maxAge: 7,
    // Máximo de entradas no cache
    maxEntries: 100
  }
}

// Função para verificar se deve forçar atualização
export function shouldForceUpdate(): boolean {
  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5)
  
  return PWA_CONFIG.forceUpdateTimes.includes(currentTime)
}

// Função para verificar se o usuário está ativo
export function isUserActive(): boolean {
  return !document.hidden && document.visibilityState === 'visible'
}

// Função para agendar verificação de atualizações
export function scheduleUpdateCheck(): void {
  if ('serviceWorker' in navigator) {
    setInterval(() => {
      if (isUserActive()) {
        navigator.serviceWorker.getRegistration()?.update()
      }
    }, PWA_CONFIG.checkUpdateInterval * 60 * 1000)
  }
}
