import { Typography, Avatar, Space, Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import styles from './ReviewCard.module.scss'
import { IReviewCardProps } from '@entities/review/hooks/model/types'

const { Text, Paragraph } = Typography

export const ReviewCard = ({ review, isOwn, onDelete }: IReviewCardProps) => {
  const userName = review.user?.name || 'Анонимный пользователь'
  const firstLetter = userName[0].toUpperCase()

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Space size={12}>
          <Avatar
            size="large"
            style={{
              backgroundColor: isOwn ? '#87d068' : '#1890ff',
              verticalAlign: 'middle',
            }}
          >
            {firstLetter}
          </Avatar>

          <div className={styles.userInfo}>
            <Space>
              <Text strong className={styles.userName}>
                {userName}
              </Text>
              {isOwn && <span className={styles.badge}>Вы</span>}
            </Space>
            <Text className={styles.date}>
              {dayjs(review.createdAt).locale('ru').format('DD MMMM YYYY')}
            </Text>
          </div>
        </Space>

        {isOwn && (
          <Space>
            <Tooltip title="Удалить">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete?.(review.id)}
              />
            </Tooltip>
          </Space>
        )}
      </div>

      <Paragraph className={styles.content}>{review.description}</Paragraph>
    </div>
  )
}
