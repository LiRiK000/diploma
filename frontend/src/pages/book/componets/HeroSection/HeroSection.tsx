import { Rate, Button } from 'antd'
import {
  HeartOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import styles from './HeroSection.module.scss'
import { handleShare, handleWantToCard, handleWantToRead } from './utils'
import { HeroSectionProps } from './types'

export const HeroSection = ({
  title,
  author,
  coverUrl,
  publishYear,
  rating,
  ratingsCount,
}: HeroSectionProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img
          src={coverUrl ?? '/book.png'}
          alt={title}
          className={styles.cover}
        />

        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.author}>
            {author} {publishYear}
          </p>

          <div className={styles.rating}>
            <span className={styles.ratingText}>
              ({ratingsCount.toLocaleString()} reviews)
            </span>
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => handleWantToCard(title)}
            >
              Добавить в корзину
            </Button>
            <Button
              type="primary"
              icon={<HeartOutlined />}
              onClick={() => handleWantToRead(title)}
            >
              Хочу прочитать
            </Button>

            <Button icon={<ShareAltOutlined />} onClick={handleShare}>
              Поделиться
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
