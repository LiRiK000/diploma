import { Card, Rate, Typography } from 'antd'
import styles from './ReviewSection.module.scss'
import { Review } from './types'

const { Text, Paragraph } = Typography
export const ReviewCard = ({ review }: { review: Review }) => (
  <Card className={styles.reviewCard} variant={'borderless'}>
    <div className={styles.reviewHeader}>
      <Text strong>{review.author}</Text>
      <Text type="secondary" className={styles.date}>
        {review.date}
      </Text>
    </div>
    <Paragraph className={styles.content}>{review.content}</Paragraph>
  </Card>
)
