import { Card, Typography, Divider, Button } from 'antd'
import styles from './BookSidebar.module.scss'
import { UserOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

interface BookSidebarProps {
  authorName: string
  authorBio: string
}

export const BookSidebar = ({ authorName, authorBio }: BookSidebarProps) => {
  return (
    <Card className={styles.sidebar} bordered={false}>
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
        style={{ fontSize: '0.75rem', padding: '0 8px', height: '24px' }}
      >
        На страницу автора
      </Button>
    </Card>
  )
}
