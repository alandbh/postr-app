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
