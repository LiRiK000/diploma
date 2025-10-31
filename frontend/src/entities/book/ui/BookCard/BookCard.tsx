import styles from './BookCard.module.scss'
import { Card, Button, Typography, Tag } from 'antd'
import { BookCardProps } from './types'

const { Title } = Typography
export const BookCard = ({ book }: BookCardProps) => {
  const onAddToCart = (bookId: string) => {
    console.log(bookId)
  }

  return (
    <Card className={styles.card} variant={'borderless'}>
      <div className={styles.cover}>
        <img src={'/book.png'} alt={book.title} className={styles.coverImage} />
      </div>
      <div className={styles.info}>
        <Title className={styles.title} level={3}>
          {book.title}
        </Title>
        <div className={styles.meta}>
          <span className={styles.author}>{book.author}</span>
          <Tag color="processing">{book.subjects[0]}</Tag>
        </div>
        <p className={styles.available}>Доступно: {book.availableQuantity}</p>
        <Button
          type="primary"
          block
          disabled={book.availableQuantity === 0}
          onClick={() => onAddToCart?.(book.id)}
        >
          Добавить в корзину
        </Button>
      </div>
    </Card>
  )
}
