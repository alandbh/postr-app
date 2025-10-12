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
        const isDark = root.classList.contains("dark");
        const nextIsDark = !isDark;

        root.classList.toggle("dark", nextIsDark);
        root.style.colorScheme = nextIsDark ? "dark" : "light";

        document.body.classList.toggle("bg-brand-900", nextIsDark);
        document.body.classList.toggle("text-white", nextIsDark);
        document.body.classList.toggle("bg-white", !nextIsDark);
        document.body.classList.toggle("text-brand-900", !nextIsDark);
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
                    <IconButton
                        label="Alternar tema"
                        onClick={toggleTheme}
                        icon={<span>🌓</span>}
                    />
                </div>
            </div>

            {/* Title + deck */}
            <header className="mb-4 gap-4 flex flex-col text-slate-800 dark:text-slate-200">
                <h1 className="text-3xl/tight font-serif font-semibold tracking-tight">
                    {article.title || article.url}
                </h1>
                {article.excerpt && (
                    <p className="mt-3 font-serif text-lg opacity-90 font-medium">
                        {article.excerpt}
                    </p>
                )}
            </header>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2 mb-4">
                {(article.tags ?? []).map((t) => (
                    <TagChip key={t}>{t}</TagChip>
                ))}
                <button
                    className="text-xs px-2 py-1 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5"
                    onClick={() => {
                        const t = prompt("Adicionar tag:");
                        if (!t) return;
                        const tags = [...(article.tags ?? []), t];
                        db.articles.update(article.id, { tags });
                        setArticle({ ...article, tags });
                    }}
                >
                    + Adicionar tag
                </button>
            </div>

            {/* Meta row (autor · ver original · excluir) */}
            <div className="flex flex-wrap items-center gap-3 text-sm opacity-80">
                {article.author && <span>By {article.author}</span>}
                <span className="opacity-40">•</span>
                <a
                    className="underline"
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                >
                    Ver original
                </a>
                <span className="opacity-40">•</span>
                <button onClick={onDelete} className="underline">
                    Excluir
                </button>
                <span className="ml-auto">{savedAt}</span>
            </div>

            <hr className="my-4 border-white/10" />

            {/* Cover image (se houver) */}
            {article.image && (
                <figure className="mb-6">
                    <img
                        src={article.image}
                        alt=""
                        className="w-full rounded-2xl border border-white/10 object-cover"
                    />
                </figure>
            )}

            {/* Content */}
            <div className="prose-invert dark:prose max-w-none prose-headings:scroll-mt-24">
                <div
                    dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />
            </div>
        </article>
    );
}
