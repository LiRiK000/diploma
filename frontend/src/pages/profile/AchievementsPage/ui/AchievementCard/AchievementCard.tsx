import { FC } from 'react'
import { Progress, Typography } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import styles from './AchievementCard.module.scss'
import { Achievement } from '../../achievements.mock'

const { Text } = Typography

interface AchievementCardProps {
  achievement: Achievement
}

export const AchievementCard: FC<AchievementCardProps> = ({ achievement }) => {
  const {
    title,
    description,
    icon,
    currentValue,
    targetValue,
    isCompleted,
    rewardExp,
  } = achievement
  const percent = Math.min(Math.round((currentValue / targetValue) * 100), 100)

  return (
    <div className={`${styles.card} ${isCompleted ? styles.completed : ''}`}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>{icon}</span>
          {isCompleted && <CheckCircleFilled className={styles.checkIcon} />}
        </div>
        <div className={styles.expBadge}>+{rewardExp} XP</div>
      </div>

      <div className={styles.content}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.description}>{description}</Text>
      </div>

      <div className={styles.footer}>
        <Progress
          percent={percent}
          size="small"
          showInfo={false}
          strokeColor={isCompleted ? '#52c41a' : '#1890ff'}
        />
        <div className={styles.progressInfo}>
          <Text className={styles.values}>
            {currentValue} / {targetValue}
          </Text>
          <Text className={styles.percent}>{percent}%</Text>
        </div>
      </div>
    </div>
  )
}
