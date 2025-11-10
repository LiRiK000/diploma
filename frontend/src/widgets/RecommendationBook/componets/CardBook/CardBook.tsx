import { Typography, Button } from 'antd'
import { CardBookProps } from './types'
import {
  BookOutlined,
  UserOutlined,
  StockOutlined,
  RightCircleOutlined,
} from '@ant-design/icons'
import styles from './CardBook.module.scss'

const { Title, Text } = Typography
export const CardBook = ({ book }: CardBookProps) => {
  return (
    <div className={styles.card}>
      <Title level={5} className={styles.title}>
        <BookOutlined /> {book.title}
      </Title>
      <div className={styles.authorRow}>
        <Text className={styles.author}>
          <UserOutlined /> {book.author}
        </Text>
        <Button
          type="text"
          icon={<RightCircleOutlined />}
          className={styles.iconButton}
        />
      </div>
      {book.availableQuantity && (
        <Text className={styles.quantity}>
          <StockOutlined /> {book.availableQuantity} шт.
        </Text>
      )}
    </div>
  )
}
