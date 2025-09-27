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

const API_BASE = import.meta.env.VITE_API_BASE;

export async function parseArticleFromUrl(url: string) {
    const res = await fetch(
        `${API_BASE}/extract?url=${encodeURIComponent(url)}`
    );
    if (!res.ok) throw new Error(`Parser error: ${res.status}`);
    const data = await res.json();
    return {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        image: data.image,
    };
}
