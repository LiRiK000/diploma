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
        About the Author
      </Title>

      <Divider style={{ margin: '1.rem 0' }} />

      <Text strong className={styles.name}>
        {authorName}
      </Text>

      <Paragraph className={styles.bio}>{authorBio}</Paragraph>
      <Button>На странцу автора </Button>
    </Card>
  )
}
