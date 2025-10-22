import { Card, Typography, Divider } from 'antd'
import styles from './RecommendationBook.module.scss'
import { CardBook } from './componets/CardBook/CardBook'
import { RecommendationBookProps } from './types'

const { Title } = Typography
// TODO -> Widgets
export const RecommendationBook = ({ books }: RecommendationBookProps) => {
  return (
    <Card className={styles.sidebar} variant="borderless">
      <Title level={4} className={styles.heading}>
        Книги в том же духе
      </Title>
      <Divider style={{ margin: '1rem 0' }} />

      <div className={styles.scrollContainer}>
        {books.map(book => (
          <CardBook key={book.id} book={book} />
        ))}
      </div>
    </Card>
  )
}
