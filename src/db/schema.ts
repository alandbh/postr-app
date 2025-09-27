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
