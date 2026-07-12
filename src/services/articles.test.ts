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
