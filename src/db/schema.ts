import Dexie, { Table } from 'dexie'

export type Article = {
  id: string
  url: string
  title?: string
  content?: string
  excerpt?: string
  author?: string
  image?: string
  tags: string[]
  savedAt: number
}

class PostrDB extends Dexie {
  articles!: Table<Article, string>

  constructor() {
    super('postr-db')
    this.version(1).stores({
      articles: 'id, savedAt, title, url'
    })
  }
}

export const db = new PostrDB()

export async function getAllTags(): Promise<string[]> {
  const articles = await db.articles.toArray()
  const tagSet = new Set<string>()
  articles.forEach(a => a.tags?.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
