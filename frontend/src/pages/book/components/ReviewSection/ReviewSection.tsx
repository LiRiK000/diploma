import { Typography, Divider, Spin } from 'antd'
import { ReviewForm } from '@features/review'
import styles from './ReviewSection.module.scss'
import { ReviewSectionProps } from './types'
import { ReviewCard } from './components/ReviewCard'
import { useBookReviews } from '@entities/review/hooks/useBookReviews'
import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'

const { Title, Text } = Typography

export const ReviewSection = ({ bookId, tags }: ReviewSectionProps) => {
  const { reviews, isLoading, createReview } = useBookReviews(bookId)
  const { data: meData } = useGetMe()

  const userId = meData?.data?.user?.id
  const myReview = reviews?.find(review => review.userId === userId)

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <Title level={2} style={{ margin: 0 }}>
          Рецензии
        </Title>
      </header>

      {!userId ? (
        <div className={styles.authNotice}>
          <Text className={styles.noticeText}>
            Чтобы оставить рецензию, пожалуйста, войдите в систему.
          </Text>
        </div>
      ) : myReview ? (
        <div className={styles.successNotice}>
          <Text className={styles.noticeText}>
            Спасибо! Вы уже поделились своим мнением о книге.
          </Text>
        </div>
      ) : (
        <ReviewForm onSubmit={(text: string) => createReview(text)} />
      )}

      <Divider style={{ borderColor: 'var(--glass-border)' }} />

      <div className={styles.reviews}>
        <Title level={3}>Рецензии читателей</Title>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwn={review.userId === userId}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Text type="secondary">
              У этой книги пока нет рецензий. Будьте первым!
            </Text>
          </div>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className={styles.tagsSection}>
          <Divider style={{ borderColor: 'var(--glass-border)' }} />
          <Title level={4}>Теги</Title>
          <div className={styles.tags}>
            {tags.map((tag, i) => (
              <span key={i} className={styles.tag}>
                # {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
