# Postr — PWA (Vite + React + TS + Tailwind + Dexie + PWA)

## Rodando no VS Code
```bash
npm install
npm run dev
```
Abra `http://localhost:5173`.

## Build PWA
```bash
npm run build
npm run preview
```

## Parser MLSD
O arquivo `src/lib/parser.ts` está com stub. Em dev, usamos um mock (`/api/extract`). 
No ambiente real, crie uma função serverless que:
1. Recebe `url`.
2. Faz fetch do HTML (com user-agent server-side para evitar paywalls fracos).
3. Roda Readability e retorna `{ title, content, excerpt, author, image }`.

## Share Target
Configurado no `vite.config.ts` (manifest). Após instalar o PWA no Android, ele aparece na gaveta de compartilhamento.
