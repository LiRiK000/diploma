import styles from './BookCard.module.scss'
import { Typography, Space } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { BookCardProps } from './types'
import { Link, useNavigate } from 'react-router-dom'
import { AddToCartButton } from '@features/add-to-cart/components'
import { AddToWishlistButton } from '@features/add-to-wishlist/components'

const { Title, Text } = Typography

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate()

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    void navigate(`/author/${book.authorId}`)
  }

  return (
    <Link to={`/book/${book.id}`}>
      <div className={styles.card}>
        <div className={styles.cover}>
          <div className={styles.genreBadge}>
            {typeof book.genre === 'object' ? book.genre.label : book.genre}
          </div>
          <div className={styles.bookWrapper}>
            <img
              src={book.coverUrl || '/book.png'}
              fetchPriority="high"
              loading="eager"
              className={styles.coverImage}
              alt={book.title}
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
          <div className={styles.reviews}>
            <StarFilled className={styles.starIcon} />
            <Text className={styles.count}>{book.ratingsCount || 0}</Text>
          </div>

          <div className={styles.actions}>
            <Space size={8}>
              <AddToWishlistButton
                title={book.title}
                variant="icon"
                id={book.id}
              />
              <AddToCartButton bookId={book.id} variant="icon" />
            </Space>
          </div>
        </div>
      </div>
    </Link>
  )
}
