import { FC } from 'react'
import { Progress, Typography } from 'antd'
import { CheckCircle2 } from 'lucide-react'
import styles from './AchievementCard.module.scss'
import { Achievement } from '../../types'

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
          {isCompleted && (
            <div className={styles.checkBadge}>
              <CheckCircle2 size={16} strokeWidth={2.5} />
            </div>
          )}
        </div>
        <div className={styles.expBadge}>
          <span>+{rewardExp} XP</span>
        </div>
      </div>

      <div className={styles.content}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.description}>{description}</Text>
      </div>

      <div className={styles.footer}>
        <div className={styles.progressInfo}>
          <Text className={styles.values}>
            {currentValue} <span className={styles.separator}>/</span>{' '}
            {targetValue}
          </Text>
          <Text className={styles.percentText}>{percent}%</Text>
        </div>
        <Progress
          percent={percent}
          size="small"
          showInfo={false}
          trailColor="var(--progress-trail)"
          className={styles.cardProgress}
        />
      </div>
    </div>
  )
}
