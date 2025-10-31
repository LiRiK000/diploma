import styles from './StickyHeader.module.scss'
import { StickyHeaderProps } from './types'
import { Space } from 'antd'
import { AddToWishlistButton } from '@features/add-to-wishlist/componets/AddToWishlistButton'
import { AddToCartButton } from '@features/add-to-cart/componets/AddToCartButton'

export const StickyHeader = ({
  title,
  author,
  coverUrl,
  isVisible,
}: StickyHeaderProps) => {
  return (
    <header
      className={`${styles.header} ${isVisible ? styles.visible : ''}`}
      role="banner"
      aria-label="Липкий заголовок книги"
    >
      <div className={styles.content}>
        <div className={styles.bookInfo}>
          <img
            src={coverUrl}
            alt={`Обложка книги "${title}"`}
            className={styles.cover}
            loading="lazy"
          />
          <div className={styles.textInfo}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.author}>{author}</p>
          </div>
        </div>

        <Space className={styles.buttonContainer}>
          <AddToCartButton title={title} />

          <AddToWishlistButton title={title} />
        </Space>
      </div>
    </header>
  )
}
