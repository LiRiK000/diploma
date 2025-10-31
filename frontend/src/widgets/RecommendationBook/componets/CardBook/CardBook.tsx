import { Button, Typography } from 'antd'
import styles from './CardBook.module.scss'
import { CardBookProps } from './types'
import { BookOutlined, StockOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
export const CardBook = ({ book }: CardBookProps) => {
  return (
    <div className={styles.card}>
      <Title level={5} className={styles.title}>
        <BookOutlined /> {book.title}
      </Title>
      <Text className={styles.author}>
        <UserOutlined /> {book.author}
      </Text>
      <div className={styles.WrapperButton}>
        {book.availableQuantity && (
          <Text className={styles.quantity}>
            <StockOutlined /> {book.availableQuantity} шт.
          </Text>
        )}
        <Button>Подробнее</Button>
      </div>
    </div>
  )
}
