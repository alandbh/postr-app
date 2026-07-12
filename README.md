# Postr

Leitor de artigos sem distrações: salve um link, extraia o conteúdo principal e leia em uma interface limpa, focada e privada (local-first, PWA).

Direção de produto completa em [docs/product/PRD.md](docs/product/PRD.md).

## Stack

- Frontend PWA: Vite + React + TypeScript + Tailwind
- Persistência local: IndexedDB via Dexie
- Roteamento: React Router
- Parsing de conteúdo: Cloudflare Worker (em `cloudflare/`), acessado pelo frontend via `VITE_API_BASE`

## Arquitetura em um parágrafo

O frontend é um PWA que salva artigos localmente (Dexie/IndexedDB) e lê conteúdo já extraído sem depender da página original. A extração é feita por um Cloudflare Worker que recebe uma URL, segue redirecionamentos, obtém o HTML, roda `Readability`, normaliza imagens e devolve JSON (`title`, `content`, `excerpt`, `author`, `image`). O app também suporta PWA share target para salvar links compartilhados do sistema. Detalhes em [docs/engineering/architecture-and-backlog.md](docs/engineering/architecture-and-backlog.md).

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

Defina `VITE_API_BASE` (ex.: em um `.env.local`) apontando para o Worker de parsing. Em produção o CI usa `https://postr-worker.postr-worker.workers.dev`.

## Build

```bash
npm run build          # build padrão (dist/)
npm run preview        # servir o build localmente
npm run build:cpanel   # build de produção para cPanel (dist-cpanel/ + .htaccess)
```

## Parser (Cloudflare Worker)

O parser NÃO é mais um stub: o Worker em [cloudflare/src/index.ts](cloudflare/src/index.ts) está implementado e em uso. O cliente frontend correspondente é [src/lib/parser.ts](src/lib/parser.ts). Em desenvolvimento é possível usar o mock em [src/mock-server.ts](src/mock-server.ts). O contrato formal do parser é uma spec de estabilização em aberto (ver [docs/superpowers/specs/2026-07-11-parser-contract-design.md](docs/superpowers/specs/2026-07-11-parser-contract-design.md)).

## Share Target

Configurado no manifest via `vite.config.ts` e tratado pelo service worker `public/sw-custom.js`. Após instalar o PWA, o Postr aparece na folha de compartilhamento do sistema. O endurecimento desse fluxo é uma spec em aberto (ver [docs/superpowers/specs/2026-07-11-share-target-pwa-design.md](docs/superpowers/specs/2026-07-11-share-target-pwa-design.md)).

## Deploy

CI/CD automático (push na `main` -> GitHub Actions -> FTP para cPanel) e fallback manual estão documentados em [docs/operations/deploy.md](docs/operations/deploy.md).

## Documentação

| Área | Documento |
| --- | --- |
| Produto | [docs/product/PRD.md](docs/product/PRD.md) |
| Engenharia | [docs/engineering/architecture-and-backlog.md](docs/engineering/architecture-and-backlog.md) |
| Operações | [docs/operations/deploy.md](docs/operations/deploy.md) |
| Decisões (ADRs) | [docs/decisions/README.md](docs/decisions/README.md) |
| Processo SDD / Superpowers | [docs/superpowers/README.md](docs/superpowers/README.md) |
| Guia para agentes de IA | [AGENTS.md](AGENTS.md) |

## Como contribuir

Este projeto segue Spec-Driven Development com as práticas Superpowers: brainstorming -> design doc -> plano -> TDD -> verificação -> code review. Leia [AGENTS.md](AGENTS.md) e [docs/superpowers/README.md](docs/superpowers/README.md) antes de implementar qualquer mudança relevante.
