import styles from './BookCard.module.scss'
import { Card, Typography, Tag } from 'antd'
import { BookCardProps } from './types'
import { Link, useNavigate } from 'react-router-dom'
import { AddToCartButton } from '@features/add-to-cart/components'

const { Title } = Typography

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate()

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/author/${book.authorId}`)
  }

  return (
    <Card className={styles.card} variant="borderless">
      <Link to={`/book/${book.id}`} className={styles.linkContent}>
        <div className={styles.cover}>
          <img src="/book.png" alt={book.title} className={styles.coverImage} />
        </div>

        <div className={styles.info}>
          <Title className={styles.title} level={3}>
            {book.title}
          </Title>

          <div className={styles.meta}>
            {/* Теперь это кликабельный элемент */}
            <span
              className={styles.author}
              onClick={handleAuthorClick}
              role="button"
              style={{ cursor: 'pointer' }} // Чтобы визуально было понятно, что это ссылка
            >
              {book.author}
            </span>
            <Tag className={styles.genreTag} color="processing">
              {book.genre}
            </Tag>
          </div>

          <p className={styles.available}>Доступно: {book.availableQuantity}</p>
        </div>
      </Link>

      <AddToCartButton bookId={book.id} fullWidth={true} />
    </Card>
  )
}
