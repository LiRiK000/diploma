import { Card, Button, Tag } from 'antd'
import { BookCardProps } from '../model/type'
import styles from './book.module.scss'
import placeholder from '../../../assets/book-placeholder2.png'
export const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  return (
    <Card className={styles.card} bordered={false}>
      <div className={styles.cover}>
        <img
          src={book.coverUrl || placeholder}
          alt={book.title}
          className={styles.coverImage}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <div className={styles.meta}>
          <span className={styles.author}>{book.author.name}</span>
          {<span className={styles.genre}>{book.genre.name}</span>}
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
