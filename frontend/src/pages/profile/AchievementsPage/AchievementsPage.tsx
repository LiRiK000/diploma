import styles from './AchievementsPage.module.scss'
import { ProgressBar } from './ui/ProgressBar/ProgressBar'
import { AchievementCard } from './ui/AchievementCard/AchievementCard'
import { Typography, Tabs } from 'antd'

import { Skeleton } from 'antd'
import {
  useAchievements,
  useUserStats,
} from '@entities/gamification/hooks/useGamification'
const { Title } = Typography
export const AchievementsPage = ({ className }: { className?: string }) => {
  const { data: stats, isLoading: isStatsLoading } = useUserStats()
  const { data: achievements, isLoading: isAchLoading } = useAchievements()

  if (isStatsLoading || isAchLoading) {
    return (
      <div className={styles.wrapper}>
        <Skeleton active />
      </div>
    )
  }

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <header className={styles.header}>
        <Title level={4} className={styles.title}>
          Достижения и ранги: {stats?.rank}
        </Title>
      </header>

      <section className={styles.topSection}>
        <ProgressBar
          percent={stats?.progressPercentage}
          currentLevel={stats?.level}
          totalAchievements={`${achievements?.filter(a => a.isCompleted).length} / ${achievements?.length}`}
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
                  {achievements?.map(item => (
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
                  {achievements
                    ?.filter(a => !a.isCompleted)
                    .map(item => (
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
