import { AppMeta, Content } from 'newt-client-js'
import styles from '../../styles/Article.module.css'
import Head from 'next/head'
import { useMemo } from 'react'
import { Layout } from '../../components/Layout'
import {
  fetchApp,
  fetchArticles,
  fetchCategories,
  fetchCurrentArticle,
} from '../../lib/api'
import { Article } from '../../types/article'
import { htmlToText } from 'html-to-text'
import { Category } from '../../types/category'

export default function ArticlePage({
  app,
  categories,
  articles,
  currentArticle,
}: {
  app: AppMeta
  categories: (Content & Category)[]
  articles: (Content & Article)[]
  currentArticle: (Content & Article) | null
}) {
  const meta = useMemo(() => {
    if (currentArticle?.meta) {
      return currentArticle.meta
    }
    return null
  }, [currentArticle])

  const title = useMemo(() => {
    if (meta?.title) {
      return meta.title
    }
    if (currentArticle?.title) {
      return currentArticle.title
    }
    return app.name || app.uid || ''
  }, [app, meta, currentArticle?.title])

  const description = useMemo(() => {
    if (meta?.description) {
      return meta.description
    }
    if (currentArticle?.body) {
      return htmlToText(currentArticle.body, {
        selectors: [{ selector: 'img', format: 'skip' }],
      }).slice(0, 200)
    }
    return ''
  }, [meta, currentArticle?.body])

  const ogImage = useMemo(() => {
    if (meta?.ogImage?.src) {
      return meta.ogImage.src
    }
    return ''
  }, [meta])

  const body = useMemo(() => {
    if (currentArticle?.body) {
      return {
        __html: currentArticle.body,
      }
    }
    return {
      __html: '',
    }
  }, [currentArticle?.body])

  return (
    <Layout
      app={app}
      categories={categories}
      articles={articles}
      currentArticle={currentArticle}
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <article className={styles.Article}>
        <h1 className={styles.Article_Title}>{currentArticle?.title || ''}</h1>
        <div
          className={styles.Article_Body}
          dangerouslySetInnerHTML={body}
        ></div>
      </article>
    </Layout>
  )
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params
  const app = await fetchApp()
  const categories = await fetchCategories()
  const { articles } = await fetchArticles()
  const currentArticle = await fetchCurrentArticle({ slug })
  return {
    props: {
      app,
      categories,
      articles,
      currentArticle,
    },
  }
}

export async function getStaticPaths() {
  const { articles } = await fetchArticles({
    limit: 1000,
  })
  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: 'blocking',
  }
}
