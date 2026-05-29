import { Typography, Button } from 'antd'
import { CardBookProps } from './types'
import {
  BookOutlined,
  UserOutlined,
  RightCircleOutlined,
} from '@ant-design/icons'
import styles from './CardBook.module.scss'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

export const CardBook = ({ book }: CardBookProps) => {
  const navigate = useNavigate()

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/book/${book.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className={styles.content}>
        <Title level={5} className={styles.title}>
          <BookOutlined className={styles.bookIcon} />
          {book.title}
        </Title>

        <div className={styles.authorRow}>
          <Text className={styles.author}>
            <UserOutlined />
            {book.author}
          </Text>

          <Button
            type="text"
            icon={<RightCircleOutlined />}
            className={styles.iconButton}
          />
        </div>
      </div>
    </div>
  )
}
