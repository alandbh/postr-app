import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import Button from "@/components/Button";
import BlockedErrorView from "@/components/BlockedErrorView";
import { saveArticleFromUrl, type SaveFailureReason } from "@/services/articles";

export default function Home() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ reason: SaveFailureReason; url?: string } | null>(null);

  async function onSave() {
    if (!url) return;
    setLoading(true);
    setError(null);
    const result = await saveArticleFromUrl(url);
    setLoading(false);
    if (result.ok) {
      navigate(`/reader/${result.id}`, {
        state: { newArticle: !result.alreadyExisted, alreadyExisted: result.alreadyExisted },
      });
      return;
    }
    setError({ reason: result.reason, url: result.url });
  }

  if (error) {
    const isNoUrl = error.reason === "no-url";
    return (
      <BlockedErrorView
        message={
          isNoUrl
            ? "Nenhuma URL válida encontrada no texto colado."
            : error.reason === "blocked"
              ? "Parece que este site bloqueou o Postr. 🥺"
              : "Não foi possível salvar este artigo agora."
        }
        subMessage={
          error.url && !isNoUrl
            ? "Tente acessar o artigo clicando no link original."
            : undefined
        }
        url={error.url}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans">
      <main className="mx-auto max-w-3xl px-6 pt-6 pb-16 text-center mt-10">
        <div className="flex flex-col items-center justify-center gap-5">
          <img
            src="/icons/logo-postr.svg"
            alt="Postr"
            className="mx-auto h-16 mb-6"
          />
          <p className="mx-auto max-w-2xl text-headline font-medium">
            Salve artigos, posts e notícias para ler depois…{" "}
            <a
              href="/about"
              className="text-primary underline decoration-primary-fixed underline-offset-4 hover:decoration-primary"
            >
              sem distrações!
            </a>
          </p>
        </div>
        <div className="mt-16 flex flex-col gap-3">
          <div className="w-full max-w-2xl flex items-center gap-3 flex-col">
            <Input
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSave()}
              className="h-12 rounded-full border-2 border-primary/30 focus:border-primary flex-1"
              aria-label="Cole a URL do artigo aqui"
            />
            <Button onClick={onSave} disabled={!url} isLoading={loading}>
              Salvar
            </Button>
          </div>
          <div className="mt-2 text-sm text-on-surface/80 text-left">
            Cole a URL do artigo aqui
          </div>
          <div className="mt-2 text-sm text-on-surface/80 text-left">
            V3.2.3
          </div>
        </div>
      </main>
    </div>
  );
}
