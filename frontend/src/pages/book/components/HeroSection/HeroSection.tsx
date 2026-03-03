import styles from './HeroSection.module.scss'
import { HeroSectionProps } from './types'
import { AddToCartButton } from '@features/add-to-cart/components'
import { AddToWishlistButton } from '@features/add-to-wishlist/components'
import { ToShareButton } from '@features/to-share/components'

export const HeroSection = ({
  id,
  title,
  author,
  coverUrl,
  publishYear,
  ratingsCount,
  availableQuantity,
}: HeroSectionProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img src={coverUrl} alt={title} className={styles.cover} />

        <div className={styles.info}>
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.author}>
              {author}, {publishYear}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className={styles.badge}>
              {ratingsCount.toLocaleString()} отзывов
            </span>
            <span className={styles.badge}>В наличии: {availableQuantity}</span>
          </div>

          <div className={styles.actions}>
            <AddToCartButton bookId={id} fullWidth={false} />
            <AddToWishlistButton id={id} variant="default" title={title} />
            <ToShareButton title={title} />
          </div>
        </div>
      </div>
    </section>
  )
}
