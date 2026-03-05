import styles from './AchievementsPage.module.scss'

interface AchievementsPageProps {
  className?: string
}

export const AchievementsPage = ({ className }: AchievementsPageProps) => {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      AchievementsPage
    </div>
  )
}
