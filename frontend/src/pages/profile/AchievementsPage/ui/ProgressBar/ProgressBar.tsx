import { FC } from 'react'
import { Progress, Typography } from 'antd'
import styles from './ProgressBar.module.scss'
import { ProgressBarProps } from './types'

const { Text } = Typography

export const ProgressBar: FC<ProgressBarProps> = ({
  percent = 0,
  currentLevel = 1,
  totalAchievements = '0 / 0',
  currentExp,
  nextLevelExp,
}) => {
  const remainingExp =
    nextLevelExp && currentExp ? nextLevelExp - currentExp : null

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.levelBadge}>
          <span className={styles.levelLabel}>Уровень</span>
          <span className={styles.levelValue}>{currentLevel}</span>
        </div>

        <div className={styles.stats}>
          <Text className={styles.statsTitle}>Достижения</Text>
          <Text className={styles.statsValue}>{totalAchievements}</Text>
        </div>
      </div>

      <div className={styles.progressWrapper}>
        <Progress
          percent={percent}
          showInfo={false}
          strokeColor={{
            '0%': '#1890ff',
            '100%': '#7dcb07',
          }}
          trailColor="rgba(255, 255, 255, 0.05)"
          size={{ height: 12 }}
          className={styles.antdProgress}
        />
      </div>

      <div className={styles.footer}>
        <Text className={styles.hint}>
          {remainingExp
            ? `До следующего уровня: ${remainingExp} XP`
            : `Прогресс уровня: ${percent}%`}
        </Text>
        {currentExp && nextLevelExp && (
          <Text className={styles.expCount}>
            {currentExp} / {nextLevelExp}
          </Text>
        )}
      </div>
    </div>
  )
}
