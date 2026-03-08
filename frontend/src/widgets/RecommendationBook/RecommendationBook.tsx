import { Card, Typography, Divider } from 'antd'
import styles from './RecommendationBook.module.scss'
import { CardBook } from './components/CardBook/CardBook'
import { RecommendationBookProps } from './types'

const { Title } = Typography

export const RecommendationBook = ({ books }: RecommendationBookProps) => {
  return (
    <Card className={styles.sidebar} bordered={false}>
      <Title level={4} className={styles.heading}>
        Книги в том же духе
      </Title>

      <Divider
        style={{
          margin: '0.5rem 0',
          borderColor: 'var(--glass-border)',
          opacity: 0.6,
        }}
      />

      <div className={styles.scrollContainer}>
        {books.recommendedBooks.map(book => (
          <CardBook key={book.id} book={book} />
        ))}
      </div>
    </Card>
  )
}
