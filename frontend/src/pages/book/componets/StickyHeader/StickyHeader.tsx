import styles from './StickyHeader.module.scss'
import { StickyHeaderProps } from './types'

export const StickyHeader = ({
  title,
  author,
  coverUrl,
  isVisible,
}: StickyHeaderProps) => {
  //TODO Activity
  return (
    <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.content}>
        <img src={coverUrl} alt={title} className={styles.cover} />
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.author}>{author}</p>
        </div>
      </div>
    </div>
  )
}
