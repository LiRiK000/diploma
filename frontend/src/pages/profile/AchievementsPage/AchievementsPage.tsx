import styles from './AchievementsPage.module.scss'
import { ProgressBar } from './ui/ProgressBar/ProgressBar'
import { Typography } from 'antd'

const { Title } = Typography

export const AchievementsPage = ({ className }: { className?: string }) => {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <header className={styles.header}>
        <Title level={4} className={styles.title}>
          Достижения и ранги
        </Title>
      </header>

      <section className={styles.topSection}>
        <ProgressBar
          percent={65}
          currentLevel={12}
          totalAchievements="18 / 40"
        />
      </section>

      <div className={styles.gridPlaceholder}></div>
    </div>
  )
}
