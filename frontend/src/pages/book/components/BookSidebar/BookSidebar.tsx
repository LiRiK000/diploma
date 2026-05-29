import { Card, Typography, Button, Avatar } from 'antd'
import styles from './BookSidebar.module.scss'
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { BookSidebarProps } from './types'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

export const BookSidebar = ({ authorName, authorId }: BookSidebarProps) => {
  const navigate = useNavigate()

  const handleAuthorPage = () => {
    void navigate(`/author/${authorId}`)
  }

  return (
    <Card className={styles.sidebar} variant="borderless">
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Avatar size={52} icon={<UserOutlined />} className={styles.avatar} />
        </div>

        <div className={styles.info}>
          <Text className={styles.label}>Автор книги</Text>

          <Title level={5} className={styles.name}>
            {authorName}
          </Title>
        </div>
      </div>

      <div className={styles.divider} />

      <Button
        size="large"
        onClick={handleAuthorPage}
        className={styles.authorButton}
        icon={<ArrowRightOutlined />}
      >
        Перейти к автору
      </Button>
    </Card>
  )
}
