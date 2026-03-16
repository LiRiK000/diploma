import { FC } from 'react'
import { Progress, Typography } from 'antd'
import styles from './ProgressBar.module.scss'

const { Text } = Typography

interface ProgressBarProps {
  percent?: number
  currentLevel?: number
  totalAchievements?: string
}

export const ProgressBar: FC<ProgressBarProps> = ({
  percent = 45,
  currentLevel = 5,
  totalAchievements = '12 / 30',
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.levelBadge}>
          <span className={styles.levelLabel}>Уровень</span>
          <span className={styles.levelValue}>{currentLevel}</span>
        </div>

        <div className={styles.stats}>
          <Text className={styles.statsTitle}>Общий прогресс</Text>
          <Text className={styles.statsValue}>{totalAchievements}</Text>
        </div>
      </div>

      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={{
          '0%': '#1890ff',
          '100%': '#7dcb07',
        }}
        trailColor="var(--glass-border)"
        strokeWidth={12}
        className={styles.antdProgress}
      />

      <div className={styles.footer}>
        <Text className={styles.hint}>
          До следующего уровня осталось {100 - percent}% опыта
        </Text>
      </div>
    </div>
  )
}
