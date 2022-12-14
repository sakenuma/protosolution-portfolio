import { fetchArticles, fetchCategories } from '../lib/api'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function TopPage({ slug }: { slug: string }) {
  const router = useRouter()
  useEffect(() => {
    if (slug) {
      router.replace(`/article/${slug}`)
    }
  }, [slug, router])
  return <></>
}

export async function getStaticProps() {
  const categories = await fetchCategories()
  if (categories.length === 0) {
    return {
      notFound: true,
    }
  }
  const { articles } = await fetchArticles()
  const topArticle = articles.find(
    (article) => article.category._id === categories[0]._id
  )
  if (!topArticle) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      slug: topArticle.slug,
    },
  }
}
