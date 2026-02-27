import styles from './BookCard.module.scss'
import { Typography, Button, Space } from 'antd'
import { BookCardProps } from './types'
import { Link, useNavigate } from 'react-router-dom'
import { AddToCartButton } from '@features/add-to-cart/components'
import { AddToWishlistButton } from '@features/add-to-wishlist/components'

const { Title } = Typography

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate()

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/author/${book.authorId}`)
  }

  let quantityClass = styles.quantity

  if (book.availableQuantity === 0) {
    quantityClass += ` ${styles.empty}`
  } else if (book.availableQuantity < 2) {
    quantityClass += ` ${styles.low}`
  }

  return (
    <Link to={`/book/${book.id}`}>
      <div className={styles.card}>
        <div className={styles.cover}>
          <div className={styles.genreBadge}>{book.genre}</div>

          <div className={styles.bookWrapper}>
            <img
              src={book.coverUrl || '/book.png'}
              alt={book.title}
              className={styles.coverImage}
            />

            <div className={styles.pages} />
            <div className={styles.bookmark} />
          </div>
        </div>

        <div className={styles.info}>
          <Title level={4} className={styles.title}>
            {book.title}
          </Title>

          <div className={styles.author} onClick={handleAuthorClick}>
            {book.author}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={quantityClass}>
            {book.availableQuantity > 0
              ? `В наличии: ${book.availableQuantity}`
              : 'Нет в наличии'}
          </div>

          <Space>
            <AddToWishlistButton
              title={book.title}
              variant="icon"
              id={book.id}
            />

            <AddToCartButton bookId={book.id} variant="icon" />
          </Space>
        </div>
      </div>
    </Link>
  )
}
