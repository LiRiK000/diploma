import styles from './StickyHeader.module.scss'
import { StickyHeaderProps } from './types'
import { Space } from 'antd'
import { AddToWishlistButton } from '@features/add-to-wishlist/components'
import { AddToCartButton } from '@features/add-to-cart/components'
import { ToShareButton } from '@features/to-share/components'
import { CartIcon } from '@entities/cart/components'

export const StickyHeader = ({
  id,
  title,
  author,
  coverUrl = '/book.png',
  isVisible,
}: StickyHeaderProps) => {
  console.log(coverUrl, 'scscscs')
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
          <AddToCartButton bookId={id} />

          <AddToWishlistButton title={title} />
          <ToShareButton title={title} />
          <CartIcon flag={true} />
        </Space>
      </div>
    </header>
  )
}
