import styles from './AchievementsPage.module.scss'
import { ProgressBar } from './ui/ProgressBar/ProgressBar'
import { AchievementCard } from './ui/AchievementCard/AchievementCard'
import { ACHIEVEMENTS_MOCK } from './achievements.mock'
import { Typography, Tabs } from 'antd'

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
          totalAchievements={`${ACHIEVEMENTS_MOCK.filter(a => a.isCompleted).length} / ${ACHIEVEMENTS_MOCK.length}`}
        />
      </section>

      <section className={styles.content}>
        <Tabs
          defaultActiveKey="all"
          className={styles.tabs}
          items={[
            {
              key: 'all',
              label: 'Все',
              children: (
                <div className={styles.grid}>
                  {ACHIEVEMENTS_MOCK.map(item => (
                    <AchievementCard key={item.id} achievement={item} />
                  ))}
                </div>
              ),
            },
            {
              key: 'in-progress',
              label: 'В процессе',
              children: (
                <div className={styles.grid}>
                  {ACHIEVEMENTS_MOCK.filter(a => !a.isCompleted).map(item => (
                    <AchievementCard key={item.id} achievement={item} />
                  ))}
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  )
}
