import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            strategies: "injectManifest",
            srcDir: "src",
            filename: "sw.ts",
            includeAssets: [
                "favicon.svg",
                "robots.txt",
                "apple-touch-icon.png",
            ],
            injectManifest: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
            manifest: {
                name: "Postr — Distraction-free Reader",
                short_name: "Postr",
                id: "/?id=78q",
                description:
                    "Salve links e leia artigos no Modo Leitura Sem Distrações (MLSD).",
                theme_color: "#0B1220",
                background_color: "#0B1220",
                display: "standalone",
                start_url: "/",
                scope: "/",
                icons: [
                    {
                        src: "/pwa-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/maskable-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
                share_target: {
                    action: "/share-target",
                    method: "POST",
                    enctype: "application/x-www-form-urlencoded",
                    params: {
                        title: "title",
                        text: "text",
                        url: "url",
                    },
                },
            },
        }),
    ],
});
