import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db, type Article } from "@/db/schema";

export default function Reader() {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null | undefined>(null);

    useEffect(() => {
        if (!id) return;
        db.articles.get(id).then(setArticle);
    }, [id]);

    if (!article) {
        return <div>Carregando…</div>;
    }

    return (
        <article className="prose prose-invert max-w-none">
            <div className="flex items-center justify-between gap-4 mb-6">
                <Link to="/articles" className="text-sm underline">
                    ← Meus artigos
                </Link>
                <div className="text-xs text-white/60">
                    {new Date(article.savedAt).toLocaleString("pt-BR")}
                </div>
            </div>
            <h1>{article.title || article.url}</h1>
            {article.author && (
                <p className="text-white/70">By {article.author}</p>
            )}
            <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
            <div className="mt-8 flex items-center gap-3 text-sm">
                <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                >
                    Ver original
                </a>
                <button
                    className="underline"
                    onClick={() =>
                        navigator.share?.({
                            url: location.href,
                            title: article.title,
                        })
                    }
                >
                    Compartilhar
                </button>
            </div>
        </article>
    );
}
