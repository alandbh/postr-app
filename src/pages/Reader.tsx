import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db, type Article } from "@/db/schema";
import IconButton from "@/components/IconButton";
import TagChip from "@/components/TagChip";

export default function Reader() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null | undefined>(null);

    useEffect(() => {
        if (!id) return;
        db.articles.get(id).then(setArticle);
    }, [id]);

    const savedAt = useMemo(
        () =>
            article
                ? new Date(article.savedAt).toLocaleString("pt-BR", {
                      dateStyle: "medium",
                  })
                : "",
        [article]
    );

    if (!article) return <div>Carregando…</div>;

    async function onDelete() {
        if (!id) return;
        const ok = confirm("Excluir este artigo?");
        if (!ok) return;
        await db.articles.delete(id);
        navigate("/articles");
    }

    function toggleTheme() {
        const root = document.documentElement;
        root.classList.toggle("dark");
        root.style.colorScheme = root.classList.contains("dark") ? "dark" : "light";
    }

    async function onShare() {
        if (!article) return;
        if (navigator.share) {
            await navigator.share({ title: article.title, url: article.url });
        } else {
            await navigator.clipboard.writeText(article.url);
            alert("Link copiado!");
        }
    }

    return (
        <div className="bg-surface text-on-surface dark:bg-primary-dark dark:text-white/90 min-h-screen px-4">
            <article className="max-w-3xl mx-auto">
                {/* Top actions bar */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <Link
                        to="/articles"
                        className="text-sm opacity-80 hover:opacity-100 inline-flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Todos os artigos</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <IconButton
                            label="Compartilhar"
                            onClick={onShare}
                            icon={<span>🔗</span>}
                        />
                        
                    </div>
                </div>

                {/* Article rendered via Prose */}
                <div className="prose dark:prose-invert max-w-none prose-h1:font-bold prose-p:font-serif">
                    {/* Title + deck */}
                    <header className="mb-4">
                        <h1>{article.title || article.url}</h1>
                        {article.excerpt && <p className="lead !text-article-excerpt !font-bold">{article.excerpt}</p>}
                    </header>

                    {/* Meta row (autor · ver original · excluir) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-80">
                        {article.author && <span>By {article.author}</span>}
                        <span className="opacity-40">•</span>
                        <a href={article.url} target="_blank" rel="noreferrer">
                            Ver original
                        </a>
                        <span className="opacity-40">•</span>
                        <button onClick={onDelete} className="underline">
                            Excluir
                        </button>
                        <span className="ml-auto">{savedAt}</span>
                    </div>

                    {/* Cover image (se houver) */}
                    {article.image && (
                        <figure className="!mb-6">
                            <img
                                src={article.image}
                                alt=""
                                className="!rounded-2xl"
                            />
                        </figure>
                    )}

                    {/* Content */}
                    <div
                        dangerouslySetInnerHTML={{ __html: article.content || "" }}
                    />
                </div>
            </article>
        </div>
    );
}
