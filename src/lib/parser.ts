/// <reference types="vite/client" />
// Parser MLSD (stub): estratégia em camadas
// 1) Tenta usar Readability via <iframe> + same-origin; 2) Fallback para fetch+proxy (a implementar).

export type ParsedArticle = {
    title: string;
    content: string; // HTML
    excerpt?: string;
    author?: string;
    image?: string;
};
// (Removed custom ImportMetaEnv and ImportMeta interfaces; using Vite's types)

const API_BASE =
    (import.meta.env.VITE_API_BASE?.replace(/\/$/, "") as string | undefined) ||
    "https://postr-worker.postr-worker.workers.dev";

export async function parseArticleFromUrl(url: string) {
    const endpoint = `${API_BASE}/extract?url=${encodeURIComponent(url)}`;
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`Parser error: ${res.status} ${res.statusText} — ${text.slice(0, 160)}…`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        throw new Error(
            `Resposta não-JSON da API (${contentType}). Verifique VITE_API_BASE/rota. Preview: ${text.slice(0, 160)}…`
        );
    }
    const data = JSON.parse(text);
    return {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        image: data.image,
    };
}
