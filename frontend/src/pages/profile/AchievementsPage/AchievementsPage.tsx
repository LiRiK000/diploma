import { useMemo } from 'react'
import { Tabs, Typography, Skeleton, Empty } from 'antd'
import {
  useAchievements,
  useUserStats,
} from '@entities/gamification/hooks/useGamification'
import { AchievementCard } from './ui/AchievementCard/AchievementCard'
import { ProgressBar } from './ui/ProgressBar/ProgressBar'
import styles from './AchievementsPage.module.scss'

const { Title } = Typography

export const AchievementsPage = ({ className }: { className?: string }) => {
  const { data: stats, isLoading: isStatsLoading } = useUserStats()
  const { data: achievements, isLoading: isAchLoading } = useAchievements()

  const sections = useMemo(() => {
    if (!achievements) return null
    return {
      all: achievements,
      reading: achievements.filter(a => a.category === 'READING'),
      social: achievements.filter(a => a.category === 'SOCIAL'),
      completed: achievements.filter(a => a.isCompleted),
    }
  }, [achievements])

  if (isStatsLoading || isAchLoading) {
    return (
      <div className={styles.wrapper}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    )
  }

  const tabItems = [
    { key: 'all', label: 'Все', data: sections?.all },
    { key: 'reading', label: 'Чтение', data: sections?.reading },
    { key: 'social', label: 'Социальные', data: sections?.social },
    { key: 'completed', label: 'Полученные', data: sections?.completed },
  ]

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <header className={styles.header}>
        <div className={styles.titleInfo}>
          <Title level={2} className={styles.title}>
            Мои достижения
          </Title>
          <span className={styles.rankBadge}>{stats?.rank}</span>
        </div>
      </header>

      <section className={styles.topSection}>
        <ProgressBar
          percent={stats?.progressPercent}
          currentLevel={stats?.level}
          totalAchievements={`${achievements?.filter(a => a.isCompleted).length} / ${achievements?.length}`}
        />
      </section>

      <section className={styles.content}>
        <Tabs
          defaultActiveKey="all"
          className={styles.tabs}
          items={tabItems.map(tab => ({
            key: tab.key,
            label: tab.label,
            children: tab.data?.length ? (
              <div className={styles.grid}>
                {tab.data.map(item => (
                  <AchievementCard key={item.id} achievement={item} />
                ))}
              </div>
            ) : (
              <Empty
                description="Пока здесь пусто"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }))}
        />
      </section>
    </div>
  )
}
