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
        <Space size={12}>
          <Avatar
            size="large"
            src={review.userAvatar}
            style={{
              backgroundColor: isOwn
                ? 'var(--ant-success-color)'
                : 'var(--ant-primary-color)',
              verticalAlign: 'middle',
              flexShrink: 0,
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
            </Space>
            <Text className={styles.date}>
              {dayjs(review.createdAt).locale('ru').format('DD MMMM YYYY')}
            </Text>
          </div>
        </Space>

        {isOwn && onDelete && (
          <Tooltip title="Удалить отзыв">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(review.id)}
            />
          </Tooltip>
        )}
      </div>

      <Paragraph className={styles.content}>{review.description}</Paragraph>
    </div>
  )
}
