import styles from './BookCard.module.scss'
import { Card, Typography, Tag } from 'antd'
import { BookCardProps } from './types'
import { Link } from 'react-router-dom'
import { AddToCartButton } from '@features/add-to-cart/components'

const { Title } = Typography

export const BookCard = ({ book }: BookCardProps) => {
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
            <span className={styles.author}>{book.author}</span>
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
