import { Typography, Spin, Empty } from 'antd'
import { ReviewForm } from '@features/review'
import { ReviewCard } from './components/ReviewCard'
import { useBookReviews } from '@entities/review/hooks/useBookReviews'
import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'
import styles from './ReviewSection.module.scss'
import { ReviewSectionProps } from './types'
import { pluralizeReviews } from '@shared/utils/pluralize'
const { Title, Text } = Typography

export const ReviewSection = ({ bookId, tags }: ReviewSectionProps) => {
  const { reviews, isLoading, createReview, deleteReview } =
    useBookReviews(bookId)
  const { data: meData } = useGetMe()

  const currentUserId = meData?.data?.user?.id
  const hasAlreadyReviewed = reviews?.some(r => r.userId === currentUserId)

  return (
    <section className={styles.section}>
      <div className={styles.topHeader}>
        <Title level={2} className={styles.mainTitle}>
          Рецензии
        </Title>
        <Text className={styles.countText}>
          {reviews?.length || 0} {pluralizeReviews(reviews?.length || 0)}
        </Text>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.interactionArea}>
          {!currentUserId ? (
            <div className={`${styles.statusCard} ${styles.auth}`}>
              <Text strong>Войдите в систему, чтобы оставить мнение</Text>
            </div>
          ) : hasAlreadyReviewed ? (
            <div className={`${styles.statusCard} ${styles.thankYou}`}>
              <Text strong>Ваш отзыв принят. Благодарим за мнение!</Text>
            </div>
          ) : (
            <div className={styles.formWrapper}>
              <Title level={4}>Написать отзыв</Title>
              <ReviewForm onSubmit={createReview} />
            </div>
          )}
        </div>

        <div className={styles.reviewsList}>
          {isLoading ? (
            <div className={styles.loader}>
              <Spin size="large" tip="Загрузка мнений..." />
            </div>
          ) : reviews?.length ? (
            <div className={styles.cardsStack}>
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwn={review.userId === currentUserId}
                  onDelete={deleteReview}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Станьте первым, кто напишет отзыв"
              />
            </div>
          )}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className={styles.tagsSection}>
          <div className={styles.tags}>
            {tags.map((tag, i) => (
              <span key={i} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
