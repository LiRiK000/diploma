import styles from './HeroSection.module.scss'
import { HeroSectionProps } from './types'
import { AddToCartButton } from '@features/add-to-cart/components'
import { AddToWishlistButton } from '@features/add-to-wishlist/components'
import { ToShareButton } from '@features/to-share/components'

export const HeroSection = ({
  id,
  title,
  author,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  coverUrl = '/book.png',
  publishYear,
  ratingsCount,
  availableQuantity,
}: HeroSectionProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img src={'/book.png'} alt={title} className={styles.cover} />
        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.author}>
            {author} {publishYear}
          </p>
          <div className={styles.rating}>
            <span className={styles.ratingText}>
              {ratingsCount.toLocaleString()} Рецензий
            </span>
          </div>
          <div className={styles.rating}>
            <span className={styles.ratingText}>
              Доступно {availableQuantity.toLocaleString()}
            </span>
          </div>
          <div className={styles.actions}>
            <AddToCartButton bookId={id} fullWidth={false} />
            <AddToWishlistButton title={title} />
            <ToShareButton title={title} />
          </div>
        </div>
      </div>
    </section>
  )
}
