import { Content } from 'newt-client-js'
import { Category } from './category'

export interface Article {
  title: string
  slug: string
  meta: {
    title: string
    description: string
    ogImage: { src: string } | null
  }
  body: string
  category: (Content & Category) | null
  sortOrder: number
}
