import { Typography, Avatar, Space, Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import styles from './ReviewCard.module.scss'
import { IReview } from '../types'

const { Text, Paragraph } = Typography

interface IReviewCardProps {
  review: IReview
  isOwn: boolean
  onDelete?: (id: string) => void
}

export const ReviewCard = ({ review, isOwn, onDelete }: IReviewCardProps) => {
  const displayUserName = review.userName || 'Читатель'
  const firstLetter = displayUserName[0]?.toUpperCase()

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Space size={12} align="start">
          <Avatar size={46} src={review.userAvatar} className={styles.avatar}>
            {!review.userAvatar && firstLetter}
          </Avatar>

          <div className={styles.userInfo}>
            <Space size={8} wrap>
              <Text className={styles.userName}>{displayUserName}</Text>

              {isOwn && <span className={styles.badge}>Вы</span>}

              {review.userLevelTitle && (
                <span className={styles.rankBadge}>
                  {review.userLevelTitle}
                </span>
              )}
            </Space>

            <Text className={styles.date}>
              {dayjs(review.createdAt).locale('ru').format('D MMMM YYYY')}
            </Text>
          </div>
        </Space>

        {isOwn && onDelete && (
          <Tooltip title="Удалить отзыв">
            <Button
              danger
              type="text"
              className={styles.deleteBtn}
              icon={<DeleteOutlined />}
              onClick={() => onDelete(review.id)}
            />
          </Tooltip>
        )}
      </div>

      <Paragraph className={styles.content}>{review.description}</Paragraph>
    </article>
  )
}
