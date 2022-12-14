import styles from '../../styles/Search.module.css'
import { AppMeta, Content } from 'newt-client-js'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Layout } from '../../components/Layout'
import { fetchApp, fetchCategories, fetchArticles } from '../../lib/api'
import { Article } from '../../types/article'
import { Category } from '../../types/category'
import { htmlToText } from 'html-to-text'

export default function Search({
  app,
  categories,
  articles,
}: {
  app: AppMeta
  categories: (Content & Category)[]
  articles: (Content & Article)[]
}) {
  const router = useRouter()
  const { q, page } = router.query

  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchedResults] = useState<(Content & Article)[]>(
    []
  )
  const [total, setTotal] = useState<number>(0)

  const _page = useMemo(() => {
    return Number(page) || 1
  }, [page])

  useEffect(() => {
    ;(async () => {
      if (typeof q !== 'string' || q === '') {
        return
      }
      setIsLoading(true)
      const { articles, total } = await fetchArticles({
        search: q,
        page: _page,
        limit: 100,
        format: 'text',
      })
      setSearchedResults(articles)
      setTotal(total)
      setIsLoading(false)
    })()
  }, [q, _page, router])

  return (
    <Layout app={app} categories={categories} articles={articles}>
      <Head>
        <title>{app?.name || app?.uid || ''}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.SearchResult}>
        <div className={styles.SearchResult_Text}>
          Found {total} results for your search
        </div>
        {isLoading ? (
          <p className={styles.Empty}>Searching...</p>
        ) : total > 0 ? (
          searchResults.map((article) => (
            <div key={article._id} className={styles.SearchResult_Item}>
              <div className={styles.SearchResult_ItemUrl}>
                {`${origin}/article/${article.slug}`}
              </div>
              <Link href={`/article/${article.slug}`}>
                <a className={styles.SearchResult_ItemTitle}>{article.title}</a>
              </Link>
              <div className={styles.SearchResult_ItemDescription}>
                {htmlToText(article.body)}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.Empty}>
            Please try again with different keywords.
          </p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const app = await fetchApp()
  const categories = await fetchCategories()
  if (categories.length === 0) {
    return {
      notFound: true,
    }
  }
  const { articles } = await fetchArticles()
  return {
    props: {
      app,
      articles,
      categories,
    },
  }
}
