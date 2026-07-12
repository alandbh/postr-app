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
