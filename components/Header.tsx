import { AppMeta } from 'newt-client-js'
import Link from 'next/link'
import styles from '../styles/Header.module.css'

export function Header({ app }: { app: AppMeta }): JSX.Element {
  return (
    <header className={styles.Header}>
      <div className={styles.Header_Inner}>
        <Link href="/">
          <img src="https://www.protosolution.co.jp/assets/common/img/logo_ps.png" alt="protosolution" />
        </Link>
        {/* <div className={styles.Link}>
          <a
            href="https://github.com/Newt-Inc/newt-blog-starter-nextjs"
            rel="noreferrer noopener"
            target="_blank"
          >
            GitHub
          </a>
        </div> */}
      </div>
    </header>
  )
}
