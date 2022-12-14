import { Content, createClient } from 'newt-client-js'
import { Article } from '../types/article'
import { Category } from '../types/category'

const client = createClient({
  spaceUid: process.env.NEXT_PUBLIC_NEWT_SPACE_UID,
  token: process.env.NEXT_PUBLIC_NEWT_API_TOKEN,
  apiType: process.env.NEXT_PUBLIC_NEWT_API_TYPE as 'cdn' | 'api',
})

export const fetchApp = async () => {
  const app = await client.getApp({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
  })
  return app
}

export const fetchCategories = async () => {
  const { items } = await client.getContents<Content & Category>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_CATEGORY_MODEL_UID,
    query: {
      depth: 1,
      order: ['sortOrder'],
      select: ['_id', 'name'],
      limit: 1000,
    },
  })
  return items
}

export const fetchArticles = async (options?: {
  query?: Record<string, any>
  search?: string
  category?: string
  page?: number
  limit?: number
  format?: string
}) => {
  const { query, search, category } = options || {}
  const _query = {
    ...(query || {}),
  }
  if (search) {
    _query.or = [
      {
        title: {
          match: search,
        },
      },
      {
        body: {
          match: search,
        },
      },
    ]
  }
  if (category) {
    _query.categories = category
  }
  const _limit = 1000

  const { items, total } = await client.getContents<Content & Article>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
    query: {
      depth: 2,
      limit: _limit,
      order: ['sortOrder'],
      select: ['title', 'category', 'slug', 'body', '_id'],
      ..._query,
    },
  })
  return {
    articles: items,
    total,
  }
}

export const fetchCurrentArticle = async (options: { slug: string }) => {
  const { slug } = options
  if (!slug) return null
  const article = await client.getFirstContent({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID,
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID,
    query: {
      depth: 2,
      slug,
    },
  })
  return article
}
