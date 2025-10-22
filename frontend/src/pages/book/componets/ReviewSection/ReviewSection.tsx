import { Typography, Divider } from 'antd'
import { ReviewForm } from '@features/review/index'
import styles from './ReviewSection.module.scss'
import { ReviewCard } from './ReviewCard'
import { useState } from 'react'
import { ReviewSectionProps } from './types'

const { Title } = Typography

export const ReviewSection = ({ reviews, tags }: ReviewSectionProps) => {
  const [reviewList, setReviewList] = useState(reviews)

  return (
    <section className={styles.section}>
      <Title level={2}>Рецензии</Title>

      <ReviewForm />

      <Divider style={{ margin: '0.5rem 0' }} />

      <Title level={2}>Рецензии других читателей</Title>

      <div className={styles.reviews}>
        {reviewList.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {tags.length > 0 && (
        <>
          <Divider style={{ margin: '0.5rem 0' }} />

          <div className={styles.tagsSection}>
            <Title level={4}>Теги</Title>
            <div className={styles.tags}>
              {tags.map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag.name} ({tag.count})
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
