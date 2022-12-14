import styles from '../styles/Navigation.module.css'
import { Content } from 'newt-client-js'
import { Article } from '../types/article'
import { Category } from '../types/category'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function Navigation({
  categories,
  articles,
  current,
}: {
  categories: (Content & Category)[]
  articles: (Content & Article)[]
  current?: (Content & Article) | null
}) {
  const router = useRouter()
  const { q } = router.query

  const [searchText, setSearchText] = useState(q || '')
  useEffect(() => {
    if (q) {
      setSearchText(q)
    }
  }, [q])

  const getArticlesOfCategory = useCallback(
    (categoryId: string) => {
      return articles.filter(
        (article) => article.category && article.category._id === categoryId
      )
    },
    [articles]
  )

  return (
    <nav className={styles.Nav}>
      <div className={styles.Nav_Search}>
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.3890873 1.6109127c1.81744 1.81743998 2.0970461 4.59036739.8388184 6.7018035l3.3116969 3.3126728c.3547755.3547755.3257954.9589604-.0647289 1.3494847-.3626297.3626297-.9094871.4135198-1.2698126.1348865l-.0796721-.0701576-3.22015474-3.21985629C6.7465078 11.5258295 3.60410194 11.3822765 1.6109127 9.3890873c-2.1478836-2.14788361-2.1478836-5.63029099 0-7.7781746 2.14788361-2.1478836 5.63029099-2.1478836 7.7781746 0zM2.95984943 2.95984943c-1.40288642 1.40288642-1.40288642 3.67741472 0 5.08030114 1.40288642 1.40288642 3.67741472 1.40288642 5.08030114 0 1.40288642-1.40288642 1.40288642-3.67741472 0-5.08030114-1.40288642-1.40288642-3.67741472-1.40288642-5.08030114 0z"
            fill="#333"
            fillRule="nonzero"
          />
        </svg>
        <form action="/search">
          <input
            name="q"
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
          />
        </form>
      </div>
      {categories.map((category) => (
        <NavigationMenuItem
          key={category._id}
          category={category}
          articles={getArticlesOfCategory(category._id)}
          current={current}
        />
      ))}
    </nav>
  )
}

function NavigationMenuItem({
  category,
  articles,
  current,
}: {
  category: Content & Category
  articles: (Content & Article)[]
  current?: Content & Article
}) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (current && category && current.category._id === category._id) {
      setIsOpen(true)
    }
  }, [current, category])

  return (
    <dl className={styles.Nav_Contents}>
      <dt onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#888"
              fillRule="nonzero"
              d="M13.825 7.15833333 10 10.975 6.175 7.15833333l-1.175 1.175 5 4.99999997 5-4.99999997z"
            />
          </svg>
        ) : (
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#888"
              fillRule="nonzero"
              d="m8.33333333 5-1.175 1.175L10.975 10l-3.81666667 3.825 1.175 1.175 4.99999997-5z"
            />
          </svg>
        )}
        {category.name}
      </dt>
      {isOpen && (
        <dd>
          <ul>
            {articles.map((article) => (
              <li key={article._id}>
                <Link href={`/article/${article.slug}`}>
                  <a aria-current={current?.slug === article.slug}>
                    {article.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </dd>
      )}
    </dl>
  )
}
