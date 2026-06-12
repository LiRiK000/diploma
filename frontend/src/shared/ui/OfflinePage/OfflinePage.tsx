import { WifiOff } from 'lucide-react'
import styles from './OfflinePage.module.scss'

export interface OfflinePageProps {
  onRetry: () => void
}

export const OfflinePage = ({ onRetry }: OfflinePageProps) => {
  return (
    <section className={styles.page} aria-live="polite">
      <div className={styles.card}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <WifiOff size={36} />
        </div>
        <h1 className={styles.title}>Нет подключения к интернету</h1>
        <p className={styles.description}>
          Проверьте подключение к сети и попробуйте снова.
        </p>
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Повторить
        </button>
      </div>
    </section>
  )
}
