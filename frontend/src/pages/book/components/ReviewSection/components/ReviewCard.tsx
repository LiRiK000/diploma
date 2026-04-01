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
  const firstLetter = displayUserName[0].toUpperCase()

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Space size={12} align="start">
          <Avatar
            size="large"
            src={review.userAvatar}
            style={{
              backgroundColor: isOwn
                ? 'var(--ant-success-color)'
                : 'var(--ant-primary-color)',
              flexShrink: 0,
              marginTop: '4px',
            }}
          >
            {!review.userAvatar && firstLetter}
          </Avatar>

          <div className={styles.userInfo}>
            <Space align="center" size={8} wrap>
              <Text strong className={styles.userName}>
                {displayUserName}
              </Text>
              {isOwn && <span className={styles.badge}>Вы</span>}
              {review.userLevelTitle && (
                <span className={styles.rankBadge}>
                  {review.userLevelTitle}
                </span>
              )}
            </Space>

            <div className={styles.metaInfo}>
              <Text className={styles.date}>
                {dayjs(review.createdAt).locale('ru').format('D MMMM YYYY')}
              </Text>
            </div>
          </div>
        </Space>

        {isOwn && onDelete && (
          <Tooltip title="Удалить отзыв" color="#ff4d4f">
            <Button
              type="text"
              danger
              className={styles.deleteBtn}
              icon={<DeleteOutlined className={styles.deleteIcon} />}
              onClick={() => onDelete(review.id)}
            />
          </Tooltip>
        )}
      </div>

      <Paragraph className={styles.content}>{review.description}</Paragraph>
    </div>
  )
}
