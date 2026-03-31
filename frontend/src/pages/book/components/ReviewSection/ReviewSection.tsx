import { Typography, Divider, Spin, Empty } from 'antd'
import { ReviewForm } from '@features/review'
import styles from './ReviewSection.module.scss'
import { ReviewSectionProps } from './types'
import { ReviewCard } from './components/ReviewCard'
import { useBookReviews } from '@entities/review/hooks/useBookReviews'
import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'

const { Title, Text } = Typography

export const ReviewSection = ({ bookId, tags }: ReviewSectionProps) => {
  const { reviews, isLoading, createReview, deleteReview } =
    useBookReviews(bookId)
  const { data: meData } = useGetMe()

  const currentUserId = meData?.data?.user?.id
  const hasAlreadyReviewed = reviews?.some(r => r.userId === currentUserId)

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <Title level={2}>Рецензии</Title>
      </header>

      <div className={styles.formContainer}>
        {!currentUserId ? (
          <div className={styles.authNotice}>
            <Text className={styles.noticeText}>
              Чтобы оставить рецензию, пожалуйста, войдите в систему.
            </Text>
          </div>
        ) : hasAlreadyReviewed ? (
          <div className={styles.successNotice}>
            <Text className={styles.noticeText}>
              Спасибо! Вы уже поделились своим мнением о книге.
            </Text>
          </div>
        ) : (
          <ReviewForm onSubmit={createReview} />
        )}
      </div>

      <Divider className={styles.divider} />

      <div className={styles.reviewsList}>
        <Title level={3} className={styles.listTitle}>
          Рецензии читателей
        </Title>

        {isLoading ? (
          <div className={styles.loader}>
            <Spin size="large" />
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
          <Empty
            description="У этой книги пока нет рецензий. Будьте первым!"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className={styles.empty}
          />
        )}
      </div>

      {tags?.length > 0 && (
        <div className={styles.tagsSection}>
          <Divider className={styles.divider} />
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
