import { RefreshCw } from 'lucide-react'
import styles from './UpdateBanner.module.scss'

export interface UpdateBannerProps {
  onUpdate: () => void | Promise<void>
  onDismiss: () => void
}

export const UpdateBanner = ({ onUpdate, onDismiss }: UpdateBannerProps) => {
  return (
    <aside className={styles.banner} role="alert" aria-live="assertive">
      <div className={styles.iconWrapper} aria-hidden="true">
        <RefreshCw size={22} />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Доступна новая версия приложения</h2>
        <p className={styles.description}>
          Обновите приложение, чтобы получить последние улучшения.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onUpdate}
        >
          Обновить
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onDismiss}
        >
          Позже
        </button>
      </div>
    </aside>
  )
}
