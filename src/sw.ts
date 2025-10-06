/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
  denylist: [new RegExp('^/share-target$')]
})
registerRoute(navigationRoute)

registerRoute(
  ({ request, url }) => request.method === 'GET' && url.origin === self.location.origin,
  new StaleWhileRevalidate({ cacheName: 'static-resources' })
)

self.addEventListener('fetch', event => {
  if (event.request.method !== 'POST') return

  const requestUrl = new URL(event.request.url)
  if (requestUrl.pathname !== '/share-target') return

  event.respondWith((async () => {
    const formData = await event.request.formData()
    const params = new URLSearchParams()

    for (const [name, value] of formData.entries()) {
      if (typeof value === 'string' && value) {
        params.set(name, value)
      }
    }

    const redirectUrl = new URL('/share-target', self.location.origin)
    const search = params.toString()
    if (search) redirectUrl.search = `?${search}`

    return Response.redirect(redirectUrl.toString(), 303)
  })())
})

export {}
