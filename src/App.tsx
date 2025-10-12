import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import UpdateNotification from "./components/UpdateNotification";

export default function App() {
    const { pathname } = useLocation();
    return (
        <div className="min-h-screen bg-surface text-on-surface font-sans">
            {/* Topbar */}
      <header className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-end">
      {pathname !== "/" && (
                    <Link to="/" className="font-semibold tracking-tight mr-auto mt-5">
                        <img src="/icons/logo-postr.svg" alt="Postr Homepage" className="mx-auto h-8 mb-6" />
                    </Link>
                )}
        <nav className="flex items-center gap-6 text-sm">
          <a href="/articles" className="inline-flex items-center gap-2 hover:text-primary">
            <img src="/icons/icon-bookmark.svg" alt="" className="h-5 w-5" />
            <span>Meus artigos</span>
          </a>
          <a href="/account" className="inline-flex items-center gap-2 hover:text-primary">
            <img src="/icons/icon-avatar.svg" alt="" className="h-5 w-5" />
            <span>Minha conta</span>
          </a>
          <button className="p-2 rounded-full hover:bg-primary/10" aria-label="Alternar tema">
            <img src="/icons/icon-moon.svg" alt="" className="h-5 w-5" />
          </button>
        </nav>
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
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
                <Outlet />
            </main>
            <UpdateNotification />
        </div>
    );
}
