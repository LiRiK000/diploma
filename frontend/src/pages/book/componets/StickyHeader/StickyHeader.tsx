import styles from './StickyHeader.module.scss'
import { StickyHeaderProps } from './types'
import { Button, Space, Tooltip } from 'antd'
import {
  HeartOutlined,
  ShoppingCartOutlined,
  HeartFilled,
} from '@ant-design/icons'
import { handleWantToRead } from '../HeroSection/utils'
import { useState } from 'react'

export const StickyHeader = ({
  title,
  author,
  coverUrl,
  isVisible,
  handleWantToCard,
}: StickyHeaderProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false)

  const handleAddToCart = () => {
    handleWantToCard(title)
  }

  const handleWishlistClick = () => {
    setIsInWishlist(!isInWishlist)
    handleWantToRead(title)
  }

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
          <Tooltip title="Добавить в корзину">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              size="large"
              className={styles.cartButton}
            >
              В корзину
            </Button>
          </Tooltip>

          <Tooltip
            title={
              isInWishlist ? 'Удалить из желаемого' : 'Добавить в желаемое'
            }
          >
            <Button
              type={isInWishlist ? 'primary' : 'default'}
              icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleWishlistClick}
              size="large"
              className={`${styles.wishlistButton} ${isInWishlist ? styles.inWishlist : ''}`}
              danger={isInWishlist}
            >
              {isInWishlist ? 'В желаемом' : 'Хочу прочитать'}
            </Button>
          </Tooltip>
        </Space>
      </div>
    </header>
  )
}
