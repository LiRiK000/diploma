import styles from './ProfileSettingsPage.module.scss'
import { ProfileSettings } from '@widgets/ProfileSettings'

interface ProfileSettingsPageProps {
  className?: string
}

export const ProfileSettingsPage = ({
  className,
}: ProfileSettingsPageProps) => {
  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <ProfileSettings />
    </div>
  )
}
