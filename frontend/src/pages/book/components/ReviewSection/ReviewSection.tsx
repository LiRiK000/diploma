import { Typography, Spin, Empty, Divider, Card } from 'antd'
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

  const currentUserId = meData?.data?.id

  const hasAlreadyReviewed = reviews?.some(
    review => review.userId === currentUserId,
  )

  return (
    <Card className={styles.section} bordered={false}>
      {/* Шапка секции */}
      <div className={styles.topHeader}>
        <Title level={3} className={styles.mainTitle}>
          Рецензии
        </Title>
        <Text className={styles.countText}>
          {reviews?.length || 0} {pluralizeReviews(reviews?.length || 0)}
        </Text>
      </div>

      <Divider className={styles.divider} />

      {/* Зона действия (Форма или Статус-карточка) */}
      <div className={styles.actionBlock}>
        {!currentUserId ? (
          <div className={`${styles.statusCard} ${styles.auth}`}>
            <Text strong>Войдите в систему, чтобы оставить рецензию</Text>
          </div>
        ) : hasAlreadyReviewed ? (
          <div className={`${styles.statusCard} ${styles.thankYou}`}>
            <Text strong>Ваш отзыв опубликован. Спасибо ✨</Text>
          </div>
        ) : (
          <div className={styles.formWrapper}>
            <Title level={4} className={styles.formTitle}>
              Поделиться впечатлением
            </Title>
            <ReviewForm onSubmit={createReview} />
          </div>
        )}
      </div>

      {/* Список отзывов */}
      <div className={styles.reviewsBlock}>
        {isLoading ? (
          <div className={styles.loader}>
            <Spin size="large" tip="Загрузка отзывов..." />
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
              description="Пока нет отзывов — станьте первым"
            />
          </div>
        )}
      </div>

      {/* Блок с тегами */}
      {!!tags?.length && (
        <div className={styles.tagsBlock}>
          <Divider className={styles.divider} />
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
