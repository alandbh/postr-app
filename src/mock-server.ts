// Simula uma API local durante o dev: /api/extract?url=...
// Para uso real, substitua por Cloudflare Worker, Vercel Edge ou Firebase Function.

export function setupMockServer() {
    if (!(window as any).__mock) {
        (window as any).__mock = true;
        const originalFetch = window.fetch;
        window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === "string" ? input : input.toString();
            if (url.startsWith("/api/extract")) {
                const u = new URL(url, location.origin);
                const target = u.searchParams.get("url") || "";
                return new Response(
                    JSON.stringify({
                        title: target,
                        content:
                            "<p><em>Conteúdo simulado do parser API.</em> Integre o Readability no backend.</p>",
                    }),
                    { headers: { "Content-Type": "application/json" } }
                );
            }
            return originalFetch(input as any, init);
        };
    }
}
