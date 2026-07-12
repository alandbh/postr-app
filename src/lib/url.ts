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
