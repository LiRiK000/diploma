import { Download } from 'lucide-react'
import styles from './InstallBanner.module.scss'

export interface InstallBannerProps {
  onInstall: () => void | Promise<void>
  onDismiss: () => void
}

export const InstallBanner = ({ onInstall, onDismiss }: InstallBannerProps) => {
  return (
    <aside
      className={styles.banner}
      role="dialog"
      aria-label="Установка приложения"
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        <Download size={22} />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Установить Library</h2>
        <p className={styles.description}>
          Добавьте приложение на главный экран для быстрого доступа к
          библиотеке.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onInstall}
        >
          Установить
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
