// Service Worker customizado para interceptar Share Target POST requests
import { precacheAndRoute } from 'workbox-precaching';

// Precaching
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('fetch', (event) => {
    // Interceptar POST requests para /postr/share-target
    if (event.request.method === 'POST' && event.request.url.includes('/postr/share-target')) {
        event.respondWith(handleShareTarget(event.request));
    }
});

async function handleShareTarget(request) {
    try {
        // Obter os dados do FormData
        const formData = await request.formData();
        const title = formData.get('title') || '';
        const text = formData.get('text') || '';
        const url = formData.get('url') || '';

        console.log('Share Target POST recebido:', { title, text, url });

        // Construir URL com parâmetros GET
        const params = new URLSearchParams();
        if (title) params.set('title', title);
        if (text) params.set('text', text);
        if (url) params.set('url', url);

        const redirectUrl = `/postr/share-target?${params.toString()}`;
        
        // Redirecionar para a página com os parâmetros
        return Response.redirect(redirectUrl, 303);
    } catch (error) {
        console.error('Erro ao processar Share Target:', error);
        // Em caso de erro, redirecionar para a página inicial
        return Response.redirect('/postr/', 303);
    }
}
