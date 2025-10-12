import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import UpdateNotification from "./components/UpdateNotification";
import IconButton from "@/components/IconButton";

export default function App() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans">
      {/* Topbar */}
      <header className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-end">
        {pathname !== "/" && (
          <>
            <Link to="/" className="font-semibold tracking-tight mr-auto mt-5 hidden md:block">
              <img
                src="/icons/logo-postr.svg"
                alt="Postr Homepage"
                className="mx-auto h-8 mb-6"
              />
            </Link>
            <Link to="/" className="font-semibold tracking-tight mr-auto mt-5 md:hidden">
              <img
                src="/icons/logo-postr-atom.svg"
                alt="Postr Homepage"
                className="mx-auto h-8 mb-6"
              />
            </Link>
          </>
        )}
        <nav 
        style={{ transition: "transform 0.3s ease-in-out", opacity: isMenuOpen ? 1 : 0, zIndex: isMenuOpen ? 1000 : -1 }} 
        className="items-center md:text-sm bg-surface h-[100vh] md:h-auto w-full md:w-auto z-10 fixed top-0 left-0 flex flex-col md:flex-row md:relative justify-center md:justify-end md:items-center">

<IconButton
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden absolute top-7 right-6"
          label=""
          icon={<img src="/icons/icon-close.svg" alt="" className="h-8 md:h-5 w-8 md:w-5" />}
        />
          
          <div className="-translate-x-5 -translate-y-20 flex gap-10 flex-col md:flex-row md:relative justify-center md:justify-end md:items-center text-xl">
          <a
            href="/articles"
            className="inline-flex items-center gap-4 hover:text-primary"
          >
            <img src="/icons/icon-bookmark.svg" alt="" className="h-8 md:h-5 w-8 md:w-5" />
            <span>Meus artigos</span>
          </a>
          <a
            href="/account"
            className="inline-flex items-center gap-4 hover:text-primary"
          >
            <img src="/icons/icon-avatar.svg" alt="" className="h-8 md:h-5 w-8 md:w-5" />
            <span>Minha conta</span>
          </a>
          <button
            className="inline-flex items-center gap-4 hover:text-primary"
            aria-label="Alternar tema"
          >
            <img src="/icons/icon-moon.svg" alt="" className="h-8 md:h-5 w-8 md:w-5" />
              <span>Alterar tema</span>
            </button>
          </div>
        </nav>

        <IconButton
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden"
          label=""
          icon={<img src="/icons/icon-hamburger.svg" alt="" className="h-8 md:h-5 w-8 md:w-5" />}
        />

      </header>
      {/* <header className="flex items-end justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-brand-900/80 backdrop-blur">
                {pathname !== "/" && (
                    <Link to="/" className="font-semibold tracking-tight">
                        Postr
                    </Link>
                )}
                <nav className="flex items-center gap-4 text-sm ml-auto">
                    <Link
                        to="/articles"
                        className={
                            pathname.startsWith("/articles")
                                ? "opacity-100"
                                : "opacity-70 hover:opacity-100"
                        }
                    >
                        Meus artigos
                    </Link>
                    <Link
                        to="/account"
                        className={
                            pathname.startsWith("/account")
                                ? "opacity-100"
                                : "opacity-70 hover:opacity-100"
                        }
                    >
                        Minha conta
                    </Link>
                </nav>
            </header> */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4">
        <Outlet />
      </main>
      <UpdateNotification />
    </div>
  );
}
