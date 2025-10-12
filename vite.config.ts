import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    base: "/",
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
                   srcDir: "public",
                   filename: "sw-custom.js",
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/share-target$/],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            },
            manifest: {
                name: "Postr — Distraction-free Reader",
                short_name: "Postr",
                id: "/?id=78q",
                description:
                    "Salve links e leia artigos no Modo Leitura Sem Distrações (MLSD).",
                theme_color: "#6750A4",
                background_color: "#FEF7FF",
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
                           enctype: "multipart/form-data",
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
