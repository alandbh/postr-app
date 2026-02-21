// Service Worker customizado para interceptar Share Target POST requests
import { precacheAndRoute } from 'workbox-precaching';

// Precaching
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Interceptar POST requests para /share-target
    if (event.request.method === 'POST' && event.request.url.includes('/share-target')) {
        event.respondWith(handleShareTarget(event.request));
    }
});

async function handleShareTarget(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') || '';
        const text = formData.get('text') || '';
        const url = formData.get('url') || '';

        console.log('Share Target POST recebido:', { title, text, url });

        // Buscar index.html do cache ou da rede
        const cachedResponse = await caches.match('/index.html');
        const htmlResponse = cachedResponse || await fetch('/index.html');
        const html = await htmlResponse.text();

        // Injetar os dados do share no HTML para o React ler
        const shareData = JSON.stringify({ title, text, url });
        const injectedHtml = html.replace(
            '</head>',
            `<script>window.__SHARE_TARGET_DATA__=${shareData};</script></head>`
        );

        return new Response(injectedHtml, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    } catch (error) {
        console.error('Erro ao processar Share Target:', error);
        return Response.redirect('/', 303);
    }
}
