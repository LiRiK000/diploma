import { Card, Rate, Typography } from 'antd'
import styles from './ReviewSection.module.scss'

const { Text, Paragraph } = Typography

interface Review {
  author?: string
  content: string
  date: string
}

export const ReviewCard = ({ review }: { review: Review }) => (
  <Card className={styles.reviewCard} bordered>
    <div className={styles.reviewHeader}>
      <Text strong>{review.author}</Text>
      <Text type="secondary" className={styles.date}>
        {review.date}
      </Text>
    </div>

    {/* <Rate disabled defaultValue={review.rating} className={styles.rating} /> */}

    <Paragraph className={styles.content}>{review.content}</Paragraph>
  </Card>
)
