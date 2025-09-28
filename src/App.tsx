import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function App() {
    const { pathname } = useLocation();
    return (
        <div className="min-h-dvh flex flex-col">
            <header className="flex items-end justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-brand-900/80 backdrop-blur">
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
            </header>
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
