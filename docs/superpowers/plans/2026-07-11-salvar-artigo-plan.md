# Salvar artigo - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidar o fluxo de salvar artigo em um caso de uso reutilizável e testável, removendo a lógica duplicada de Home e ShareTarget.

**Architecture:** Extrair um utilitário puro de URL (`src/lib/url.ts`) e um serviço de domínio agnóstico de framework (`src/services/articles.ts`) que retorna um resultado tipado. Home e ShareTarget passam a consumir o serviço e cuidam só de UI/navegação. Introduzir Vitest (com fake-indexeddb) como base de testes do frontend.

**Tech Stack:** TypeScript (strict), React, React Router, Dexie/IndexedDB, Vitest, fake-indexeddb.

Design doc: [../specs/2026-07-11-salvar-artigo-design.md](../specs/2026-07-11-salvar-artigo-design.md)

## Global Constraints

- Node 20; TypeScript `strict: true`.
- Alias de import: `@/*` -> `src/*` (já em `tsconfig.json` e `vite.config.ts`; replicar no Vitest).
- Schema do Dexie (tabela `articles`, `src/db/schema.ts`) permanece inalterado; todo artigo salvo tem `tags: []` e `savedAt: Date.now()`.
- O parser (`src/lib/parser.ts`) é boundary e não é alterado nesta entrega.
- Não tocar em manifest, service worker, contrato do parser nem sanitização de HTML (specs vizinhas).
- Enum de falha estável: `'no-url' | 'blocked' | 'unparseable' | 'network' | 'unknown'`.
- Commits frequentes, um por task.

---

### Task 1: Setup do Vitest + utilitário de URL

**Files:**
- Modify: `package.json` (devDeps + scripts)
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/url.ts`
- Test: `src/lib/url.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `SHARE_SERVICE_DOMAINS: string[]`
  - `extractUrlFromText(text: string): string | null`
  - `pickSharedUrl(input: { url?: string | null; text?: string | null; title?: string | null }): string | null`
  - `normalizeUrlForDedup(url: string): string`

- [ ] **Step 1: Instalar dependências e configurar o runner**

Run:
```bash
npm i -D vitest fake-indexeddb
```

Add scripts em `package.json` (bloco `"scripts"`):
```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

Create `src/test/setup.ts`:
```ts
import 'fake-indexeddb/auto'
import { webcrypto } from 'node:crypto'

if (!globalThis.crypto) {
  // @ts-expect-error polyfill do webcrypto em ambiente Node
  globalThis.crypto = webcrypto
}
```

- [ ] **Step 2: Escrever os testes que falham (`src/lib/url.test.ts`)**

```ts
import { describe, it, expect } from 'vitest'
import {
  extractUrlFromText,
  pickSharedUrl,
  normalizeUrlForDedup,
} from '@/lib/url'

describe('extractUrlFromText', () => {
  it('retorna a única URL presente', () => {
    expect(extractUrlFromText('veja https://exemplo.com/a')).toBe(
      'https://exemplo.com/a'
    )
  })

  it('com múltiplas URLs, prefere a que não é serviço de share', () => {
    const text = 'https://t.co/abc https://noticia.com/post'
    expect(extractUrlFromText(text)).toBe('https://noticia.com/post')
  })

  it('retorna null quando não há URL', () => {
    expect(extractUrlFromText('sem link aqui')).toBeNull()
  })
})

describe('pickSharedUrl', () => {
  it('prioriza url, depois text, depois title', () => {
    expect(
      pickSharedUrl({ url: 'https://a.com', text: 'https://b.com' })
    ).toBe('https://a.com')
    expect(pickSharedUrl({ text: 'olha https://b.com' })).toBe(
      'https://b.com'
    )
    expect(pickSharedUrl({ title: 'https://c.com' })).toBe('https://c.com')
  })

  it('retorna null sem candidatos', () => {
    expect(pickSharedUrl({})).toBeNull()
    expect(pickSharedUrl({ text: 'nada' })).toBeNull()
  })
})

describe('normalizeUrlForDedup', () => {
  it('iguala URLs equivalentes (host, barra final, tracking)', () => {
    const a = normalizeUrlForDedup(
      'https://Example.com/artigo/?utm_source=news'
    )
    const b = normalizeUrlForDedup('https://example.com/artigo')
    expect(a).toBe(b)
  })

  it('mantém URLs diferentes distintas', () => {
    expect(normalizeUrlForDedup('https://example.com/a')).not.toBe(
      normalizeUrlForDedup('https://example.com/b')
    )
  })
})
```

- [ ] **Step 3: Rodar e confirmar que falha**

Run: `npm test -- src/lib/url.test.ts`
Expected: FAIL (`Failed to resolve import '@/lib/url'` / função não definida).

- [ ] **Step 4: Implementar `src/lib/url.ts`**

```ts
export const SHARE_SERVICE_DOMAINS = [
  'share.google',
  'search.app',
  't.co',
  'bit.ly',
  'goo.gl',
  'tinyurl.com',
  'ow.ly',
]

export function extractUrlFromText(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex)
  if (!matches || matches.length === 0) return null
  if (matches.length === 1) return matches[0]

  const realUrl = matches.find((u) => {
    try {
      const host = new URL(u).hostname.replace(/^www\./, '')
      return !SHARE_SERVICE_DOMAINS.some(
        (d) => host === d || host.endsWith('.' + d)
      )
    } catch {
      return false
    }
  })

  return realUrl || matches[0]
}

export function pickSharedUrl(input: {
  url?: string | null
  text?: string | null
  title?: string | null
}): string | null {
  for (const candidate of [input.url, input.text, input.title]) {
    if (candidate) {
      const found = extractUrlFromText(candidate)
      if (found) return found
    }
  }
  return null
}

export function normalizeUrlForDedup(url: string): string {
  try {
    const u = new URL(url)
    u.hostname = u.hostname.toLowerCase()
    u.hash = ''

    const toDelete: string[] = []
    u.searchParams.forEach((_value, key) => {
      const lower = key.toLowerCase()
      if (lower === 'fbclid' || lower === 'gclid' || lower.startsWith('utm_')) {
        toDelete.push(key)
      }
    })
    toDelete.forEach((k) => u.searchParams.delete(k))

    if (u.pathname.length > 1 && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.replace(/\/+$/, '')
    }

    return u.toString()
  } catch {
    return url.trim()
  }
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `npm test -- src/lib/url.test.ts`
Expected: PASS (todos os testes verdes).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/lib/url.ts src/lib/url.test.ts
git commit -m "test: add Vitest setup and URL utility for save-article"
```

---

### Task 2: Serviço de domínio saveArticleFromUrl / saveSharedArticle

**Files:**
- Create: `src/services/articles.ts`
- Test: `src/services/articles.test.ts`

**Interfaces:**
- Consumes:
  - `extractUrlFromText`, `pickSharedUrl`, `normalizeUrlForDedup` de `@/lib/url` (Task 1)
  - `parseArticleFromUrl(url: string): Promise<{ title: string; content: string; excerpt?: string; author?: string; image?: string }>` de `@/lib/parser`
  - `db` de `@/db/schema` (tabela `articles`)
- Produces:
  - `type SaveFailureReason = 'no-url' | 'blocked' | 'unparseable' | 'network' | 'unknown'`
  - `type SaveArticleResult = { ok: true; id: string; alreadyExisted: boolean } | { ok: false; reason: SaveFailureReason; url?: string }`
  - `saveArticleFromUrl(rawUrl: string): Promise<SaveArticleResult>`
  - `saveSharedArticle(input: { url?: string | null; text?: string | null; title?: string | null }): Promise<SaveArticleResult>`

- [ ] **Step 1: Escrever os testes que falham (`src/services/articles.test.ts`)**

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { db } from '@/db/schema'

vi.mock('@/lib/parser', () => ({
  parseArticleFromUrl: vi.fn(),
}))

import { parseArticleFromUrl } from '@/lib/parser'
import { saveArticleFromUrl, saveSharedArticle } from '@/services/articles'

const mockedParse = vi.mocked(parseArticleFromUrl)

beforeEach(async () => {
  await db.articles.clear()
  mockedParse.mockReset()
})

const parsed = {
  title: 'Título',
  content: '<p>corpo</p>',
  excerpt: 'resumo',
  author: 'Autor',
  image: 'https://exemplo.com/img.png',
}

describe('saveArticleFromUrl', () => {
  it('salva uma URL nova e retorna o id', async () => {
    mockedParse.mockResolvedValue(parsed)
    const result = await saveArticleFromUrl('https://exemplo.com/post')
    expect(result).toEqual({
      ok: true,
      id: expect.any(String),
      alreadyExisted: false,
    })
    const rows = await db.articles.toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0].tags).toEqual([])
    expect(rows[0].title).toBe('Título')
  })

  it('deduplica URLs equivalentes e navega para o existente', async () => {
    mockedParse.mockResolvedValue(parsed)
    const first = await saveArticleFromUrl('https://exemplo.com/post')
    const second = await saveArticleFromUrl(
      'https://exemplo.com/post/?utm_source=x'
    )
    expect(second).toEqual({
      ok: true,
      id: (first as { id: string }).id,
      alreadyExisted: true,
    })
    expect(mockedParse).toHaveBeenCalledTimes(1)
    expect(await db.articles.count()).toBe(1)
  })

  it('retorna no-url quando não há URL', async () => {
    const result = await saveArticleFromUrl('só um texto sem link')
    expect(result).toEqual({ ok: false, reason: 'no-url' })
    expect(await db.articles.count()).toBe(0)
  })

  it('mapeia falhas do parser para reason', async () => {
    mockedParse.mockRejectedValueOnce(new TypeError('fetch failed'))
    expect(await saveArticleFromUrl('https://a.com/1')).toEqual({
      ok: false,
      reason: 'network',
      url: 'https://a.com/1',
    })

    mockedParse.mockRejectedValueOnce(new Error('Parser error: 422 Unable to parse'))
    expect(await saveArticleFromUrl('https://a.com/2')).toEqual({
      ok: false,
      reason: 'unparseable',
      url: 'https://a.com/2',
    })

    mockedParse.mockRejectedValueOnce(new Error('Parser error: 403 Forbidden'))
    expect(await saveArticleFromUrl('https://a.com/3')).toEqual({
      ok: false,
      reason: 'blocked',
      url: 'https://a.com/3',
    })

    mockedParse.mockRejectedValueOnce(new Error('coisa estranha'))
    expect(await saveArticleFromUrl('https://a.com/4')).toEqual({
      ok: false,
      reason: 'unknown',
      url: 'https://a.com/4',
    })
  })
})

describe('saveSharedArticle', () => {
  it('extrai a URL dos dados de share e salva', async () => {
    mockedParse.mockResolvedValue(parsed)
    const result = await saveSharedArticle({
      text: 'olha isso https://exemplo.com/compartilhado',
    })
    expect(result).toEqual({
      ok: true,
      id: expect.any(String),
      alreadyExisted: false,
    })
  })

  it('retorna no-url quando nenhum campo tem URL', async () => {
    const result = await saveSharedArticle({ title: 'sem link' })
    expect(result).toEqual({ ok: false, reason: 'no-url' })
  })
})
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npm test -- src/services/articles.test.ts`
Expected: FAIL (`Failed to resolve import '@/services/articles'`).

- [ ] **Step 3: Implementar `src/services/articles.ts`**

```ts
import { db } from '@/db/schema'
import { parseArticleFromUrl } from '@/lib/parser'
import { extractUrlFromText, normalizeUrlForDedup, pickSharedUrl } from '@/lib/url'

export type SaveFailureReason =
  | 'no-url'
  | 'blocked'
  | 'unparseable'
  | 'network'
  | 'unknown'

export type SaveArticleResult =
  | { ok: true; id: string; alreadyExisted: boolean }
  | { ok: false; reason: SaveFailureReason; url?: string }

function mapParserError(err: unknown): SaveFailureReason {
  if (err instanceof TypeError) return 'network'
  const message = err instanceof Error ? err.message : String(err)
  if (/\b422\b/.test(message) || /unable to parse/i.test(message)) {
    return 'unparseable'
  }
  if (/\b(4\d\d|5\d\d)\b/.test(message)) return 'blocked'
  return 'unknown'
}

export async function saveArticleFromUrl(
  rawUrl: string
): Promise<SaveArticleResult> {
  let cleanUrl = rawUrl.trim()
  if (!cleanUrl.startsWith('http')) {
    const extracted = extractUrlFromText(cleanUrl)
    if (!extracted) return { ok: false, reason: 'no-url' }
    cleanUrl = extracted
  }

  const normalized = normalizeUrlForDedup(cleanUrl)
  const existing = (await db.articles.toArray()).find(
    (a) => normalizeUrlForDedup(a.url) === normalized
  )
  if (existing) {
    return { ok: true, id: existing.id, alreadyExisted: true }
  }

  let parsed
  try {
    parsed = await parseArticleFromUrl(cleanUrl)
  } catch (err) {
    return { ok: false, reason: mapParserError(err), url: cleanUrl }
  }

  const id = crypto.randomUUID()
  await db.articles.add({
    id,
    url: cleanUrl,
    title: parsed.title,
    content: parsed.content,
    excerpt: parsed.excerpt,
    author: parsed.author,
    image: parsed.image,
    tags: [],
    savedAt: Date.now(),
  })
  return { ok: true, id, alreadyExisted: false }
}

export async function saveSharedArticle(input: {
  url?: string | null
  text?: string | null
  title?: string | null
}): Promise<SaveArticleResult> {
  const url = pickSharedUrl(input)
  if (!url) return { ok: false, reason: 'no-url' }
  return saveArticleFromUrl(url)
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npm test`
Expected: PASS (suites de `url` e `articles` verdes).

- [ ] **Step 5: Commit**

```bash
git add src/services/articles.ts src/services/articles.test.ts
git commit -m "feat: add save-article domain service with dedup and typed result"
```

---

### Task 3: Integrar Home ao serviço

**Files:**
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `saveArticleFromUrl`, `type SaveFailureReason` de `@/services/articles` (Task 2).
- Produces: nada (página).

- [ ] **Step 1: Reescrever `src/pages/Home.tsx` para usar o serviço**

Substituir o conteúdo do arquivo por:

```tsx
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
            V3.2.2
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos e build**

Run: `npm run typecheck`
Expected: PASS sem erros novos em `src/pages/Home.tsx` (a lógica duplicada de `extractUrlFromText`/`SHARE_SERVICE_DOMAINS` e os imports de `db`/`parseArticleFromUrl` foram removidos).

Run: `npm run build`
Expected: build conclui com sucesso.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "refactor: use save-article service in Home page"
```

---

### Task 4: Integrar ShareTarget, remover UI de debug e corrigir bug

**Files:**
- Modify: `src/pages/ShareTarget.tsx`

**Interfaces:**
- Consumes: `saveSharedArticle`, `type SaveFailureReason` de `@/services/articles` (Task 2); `extractUrlFromText` de `@/lib/url` (Task 1).
- Produces: nada (página).

- [ ] **Step 1: Reescrever `src/pages/ShareTarget.tsx`**

Substituir o conteúdo do arquivo por:

```tsx
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
```

- [ ] **Step 2: Verificar tipos e build**

Run: `npm run typecheck`
Expected: PASS. O erro de escopo do `cleanUrl` no `catch` deixa de existir e a UI de debug foi removida.

Run: `npm run build`
Expected: build conclui com sucesso.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ShareTarget.tsx
git commit -m "refactor: use shared save-article service in ShareTarget, drop debug UI"
```

---

## Notas de execução

- Dedup usa `db.articles.toArray()` + `find` por simplicidade (dataset local-first pequeno). Se a biblioteca crescer muito, uma futura melhoria é indexar um campo normalizado.
- Home perde o comportamento de reescrever o campo de input com a URL extraída; a extração agora é interna ao serviço (aceitável).
- Testes de componente (Home/ShareTarget) estão fora de escopo desta entrega (o plano de testes da spec cobre `url.ts` e `articles.ts`); a verificação das páginas é por typecheck + build.
- Se `npm run typecheck` acusar erros pré-existentes não relacionados a estes arquivos, não corrigir aqui — registrar para outra entrega.
