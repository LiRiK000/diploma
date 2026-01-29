import { Card, Typography, Divider, Button } from 'antd'
import styles from './BookSidebar.module.scss'
import { UserOutlined } from '@ant-design/icons'
import { BookSidebarProps } from './types'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
export const BookSidebar = ({ authorName, authorId }: BookSidebarProps) => {
  const navigate = useNavigate()
  console.log(authorId)
  const handleAuthorPage = () => {
    navigate(`/author/${authorId}`)
  }

  return (
    <Card className={styles.sidebar} variant={'borderless'}>
      <Title level={4} className={styles.heading}>
        <UserOutlined />
        Автор
      </Title>
      <Divider style={{ margin: '0.2rem 0' }} />
      <Text strong className={styles.name}>
        {authorName}
      </Text>
      <Button
        size="small"
        onClick={handleAuthorPage}
        className={styles.authorButton}
      >
        На страницу автора
      </Button>
    </Card>
  )
}
