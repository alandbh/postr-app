import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSharedArticle, type SaveFailureReason } from "@/services/articles";
import { extractUrlFromText } from "@/lib/url";
import BlockedErrorView from "@/components/BlockedErrorView";

export default function ShareTarget() {
  const navigate = useNavigate();
  const [error, setError] = useState<{ reason: SaveFailureReason; url?: string } | null>(null);

  useEffect(() => {
    const run = async () => {
      const swData = (window as any).__SHARE_TARGET_DATA__ as
        | { title?: string; text?: string; url?: string }
        | undefined;
      const sp = new URLSearchParams(location.search);

      const input = {
        url: swData?.url ?? sp.get("url"),
        text: swData?.text ?? sp.get("text"),
        title: swData?.title ?? sp.get("title"),
      };

      let result = await saveSharedArticle(input);

      // Fallback de transporte: extrair da própria URL da página quando não há params.
      if (!result.ok && result.reason === "no-url") {
        const fromHref = extractUrlFromText(location.href);
        if (fromHref && !fromHref.includes("/share-target")) {
          result = await saveSharedArticle({ url: fromHref });
        }
      }

      if (result.ok) {
        navigate(`/reader/${result.id}`, {
          state: { newArticle: !result.alreadyExisted, alreadyExisted: result.alreadyExisted },
        });
        return;
      }
      setError({ reason: result.reason, url: result.url });
    };

    run();
  }, []);

  if (error) {
    const isNoUrl = error.reason === "no-url";
    return (
      <BlockedErrorView
        message={
          isNoUrl
            ? "Não encontramos uma URL para processar nos dados compartilhados."
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
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center px-4">
      <p className="opacity-80">Processando compartilhamento…</p>
    </div>
  );
}
