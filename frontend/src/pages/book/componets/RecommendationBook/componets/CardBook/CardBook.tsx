import { Typography } from 'antd'
import styles from './CardBook.module.scss'
import { CardBookProps } from './types'

const { Title, Text, Paragraph } = Typography

export const CardBook = ({ book }: CardBookProps) => {
  return (
    <div className={styles.card}>
      <Title level={5} className={styles.title}>
        {book.title}
      </Title>
      <Text className={styles.author}>{book.author}</Text>
      <Paragraph className={styles.rating}>Рейтинг: {book.rating} ⭐</Paragraph>
      <Paragraph className={styles.year}>Год: {book.publishYear}</Paragraph>
    </div>
  )
}
