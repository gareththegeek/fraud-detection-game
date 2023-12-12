import styles from '../page.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Levels() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/level-select.png"
          alt="Level Select Title"
          width={400}
          height={80}
          priority
        />
      </div>

      <div className={styles.grid}>
        <Link href="/game/level1" className={styles.card}>
          <Image
            src="/level1.png"
            alt="Level 1"
            width={320}
            height={140}
            priority
          />
        </Link>
      </div>
    </main>
  )
}