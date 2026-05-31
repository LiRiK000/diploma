import styles from './HeroSection.module.scss'
import { HeroSectionProps } from './types'

import { AddToCartButton } from '@features/add-to-cart/components'
import { AddToWishlistButton } from '@features/add-to-wishlist/components'
import { ToShareButton } from '@features/to-share/components'

import { pluralizePieces, pluralizeReviews } from '@shared/utils/pluralize'

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
        <div className={styles.coverWrapper}>
          <img
            src={coverUrl || '/book.png'}
            alt={`Обложка книги: ${title}`}
            className={styles.cover}
            loading="eager"
          />
        </div>

        <div className={styles.info}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>

            <div className={styles.meta}>
              <span className={styles.author}>{author}</span>
              <span className={styles.metaDot} aria-hidden="true">
                •
              </span>
              <span>{publishYear} г.</span>
            </div>
          </header>

          <div className={styles.badges} aria-label="Информация о книге">
            <span className={styles.badge}>
              {ratingsCount.toLocaleString()} {pluralizeReviews(ratingsCount)}
            </span>

            <span
              className={`${styles.badge} ${
                availableQuantity > 0 ? styles.inStock : styles.outOfStock
              }`}
            >
              {availableQuantity > 0 ? (
                <>
                  В наличии: {availableQuantity}{' '}
                  {pluralizePieces(availableQuantity)}
                </>
              ) : (
                'Нет в наличии'
              )}
            </span>
          </div>

          <div className={styles.actions}>
            <div className={styles.primaryAction}>
              <AddToCartButton bookId={id} fullWidth />
            </div>

            <div className={styles.secondaryActions}>
              <AddToWishlistButton id={id} variant="default" title={title} />
              <ToShareButton title={title} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
