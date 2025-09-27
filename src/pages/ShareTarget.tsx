import React, { useEffect } from 'react'
import { db } from '@/db/schema'

// Recebe POST share_target (urlencoded). Vite em dev não lida com POST de fora,
// mas em build (PWA) o navegador entrega para esta rota com params na URL (?title=&text=&url=).
export default function ShareTarget() {
  useEffect(() => {
    const sp = new URLSearchParams(location.search)
    const url = sp.get('url')
    if (url) {
      const id = crypto.randomUUID()
      db.articles.add({ id, url, tags: [], savedAt: Date.now() })
        .then(() => { location.replace('/reader/' + id) })
    }
  }, [])
  return <div>Salvando link compartilhado…</div>
}
