import { Card, Typography } from 'antd'
import styles from './RecommendationBook.module.scss'
import { CardBook } from './components/CardBook/CardBook'
import { RecommendationBookProps } from './types'

const { Title } = Typography

export const RecommendationBook = ({ books }: RecommendationBookProps) => {
  if (!books?.recommendedBooks || books.recommendedBooks.length === 0)
    return null

  return (
    <Card className={styles.sidebar} bordered={false}>
      <Title level={4} className={styles.heading}>
        Книги в том же духе
      </Title>

      <div className={styles.scrollContainer}>
        {books.recommendedBooks.map(book => (
          <CardBook key={book.id} book={book} />
        ))}
      </div>
    </Card>
  )
}
