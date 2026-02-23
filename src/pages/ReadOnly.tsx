import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { db } from "@/db/schema";
import { parseArticleFromUrl } from "@/lib/parser";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import InstallPrompt from "@/components/InstallPrompt";

interface ParsedArticle {
    url: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    image: string;
}

export default function ReadOnly() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<ParsedArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const urlParam = searchParams.get("url");

    useEffect(() => {
        if (!urlParam) {
            setError("Nenhuma URL fornecida");
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            try {
                setLoading(true);
                const parsed = await parseArticleFromUrl(urlParam);
                setArticle({
                    url: urlParam,
                    title: parsed.title,
                    content: parsed.content,
                    excerpt: parsed.excerpt,
                    author: parsed.author,
                    image: parsed.image,
                });
            } catch (err) {
                setError("Erro ao carregar o artigo: " + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [urlParam]);

    async function onSave() {
        if (!article) return;
        
        setSaving(true);
        try {
            const id = crypto.randomUUID();
            await db.articles.add({
                id,
                url: article.url,
                title: article.title,
                content: article.content,
                excerpt: article.excerpt,
                author: article.author,
                image: article.image,
                tags: [],
                savedAt: Date.now(),
            });
            navigate(`/reader/${id}`, { state: { newArticle: true } });
        } catch (err) {
            alert("Erro ao salvar: " + (err as Error).message);
            setSaving(false);
        }
    }

    async function onShareOriginal() {
        if (!article) return;
        if (navigator.share) {
            await navigator.share({ title: article.title, url: article.url });
        } else {
            await navigator.clipboard.writeText(article.url);
            alert("Link copiado!");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-on-surface/70">Carregando artigo...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
                <p className="text-red-500">{error || "Artigo não encontrado"}</p>
                <Link to="/" className="text-primary hover:underline">
                    Voltar ao início
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface dark:bg-primary-dark dark:text-white/90 min-h-screen px-4">
            <article className="max-w-3xl mx-auto pb-20">
                {/* Top actions bar */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <Link
                        to="/"
                        className="text-sm opacity-80 hover:opacity-100 inline-flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Início</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <IconButton
                            label="Compartilhar original"
                            onClick={onShareOriginal}
                            icon={<span>🔗</span>}
                        />
                    </div>
                </div>

                {/* Save banner */}
                {/* <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <p className="font-medium text-primary">Gostou do artigo?</p>
                        <p className="text-sm text-on-surface/70">Salve na sua biblioteca para ler depois</p>
                    </div>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap"
                    >
                        {saving ? "Salvando..." : "Salvar na biblioteca"}
                    </button>
                </div> */}

                {/* Article rendered via Prose */}
                <div className="prose dark:prose-invert max-w-none prose-h1:font-bold prose-p:font-serif">
                    <header className="mb-10">
                        <h1>{article.title || article.url}</h1>
                        {article.image && (
                            <figure className="!mb-6">
                                <img
                                    src={article.image}
                                    alt=""
                                    className="!rounded-2xl"
                                />
                            </figure>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-80">
                            {article.author && <span>By {article.author}</span>}
                            <span className="opacity-40">•</span>
                            <a href={article.url} target="_blank" rel="noreferrer">
                                Ver original
                            </a>
                        </div>
                    </header>

                    <div
                        dangerouslySetInnerHTML={{ __html: article.content || "" }}
                    />
                </div>

                {/* Bottom save CTA */}
                <div className="mt-10 mb-8 text-center border-t border-on-surface/50 pt-10">
                <h2 className="text-lg font-bold text-on-surface mb-4">Gostou do artigo?</h2>
                <p className="text-sm text-on-surface/70 mb-8">Salve na sua biblioteca para ler depois</p>
                    <Button onClick={onSave} disabled={saving} isLoading={saving} full>
                        Salvar na minha biblioteca
                    </Button>
                    
                </div>
            </article>
            
            <InstallPrompt />
        </div>
    );
}
