import { AppMeta, Content } from 'newt-client-js'
import { PropsWithChildren } from 'react'
import styles from '../styles/Layout.module.css'
import { Article } from '../types/article'
import { Category } from '../types/category'
import { Badge } from './Badge'
import { Footer } from './Footer'
import { Header } from './Header'
import { Navigation } from './Navigation'

export function Layout({
  app,
  categories,
  articles,
  currentArticle,
  children,
}: PropsWithChildren<{
  app: AppMeta
  categories: (Content & Category)[]
  articles: (Content & Article)[]
  currentArticle?: (Content & Article) | null
}>): JSX.Element {
  return (
    <div className={styles.Wrapper}>
      <Header app={app} />
      <main className={styles.Main}>
        <Navigation
          current={currentArticle}
          articles={articles}
          categories={categories}
        />
        {children}
      </main>
      <Footer app={app} />
      {/* <Badge /> */}
    </div>
  )
}
