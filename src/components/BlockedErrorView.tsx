import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

type Props = {
  message: string;
  subMessage?: string;
  url?: string;
};

export default function BlockedErrorView({ message, subMessage, url }: Props) {
  return (
    <div className="min-h-screen bg-surface text-on-surface dark:bg-primary-dark dark:text-white/90 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-sm w-full flex flex-col items-center text-center">
        <Link to="/" className="mb-6">
          <img
            src="/icons/logo-postr.svg"
            alt="Postr"
            className="h-8"
          />
        </Link>

        <h1 className="text-2xl font-bold font-serif mb-4">Eita!!</h1>

        <img
          src="/icons/icon-brokenlink.svg"
          alt=""
          className="w-16 h-16 mb-6"
          aria-hidden
        />

        <p className="text-on-surface/90 dark:text-white/90 mb-2">{message}</p>
        {subMessage && (
          <p className="text-on-surface/70 dark:text-white/70 text-sm mb-8">
            {subMessage}
          </p>
        )}
        {!subMessage && <div className="mb-8" />}

        <div className="w-full flex flex-col gap-3">
          {url && (
            <Button
              full
              variant="primary"
              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            >
              Acessar link original
            </Button>
          )}
          <Link
            to="/"
            className="h-12 px-8 py-3 w-full rounded-xl inline-flex items-center justify-center font-semibold leading-6 text-on-surface/50 hover:text-on-surface/70 hover:bg-on-surface/5 active:bg-on-surface/10 transition-colors dark:text-white/50 dark:hover:text-white/70 dark:hover:bg-white/5 dark:active:bg-white/10"
          >
            Voltar para a tela inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
