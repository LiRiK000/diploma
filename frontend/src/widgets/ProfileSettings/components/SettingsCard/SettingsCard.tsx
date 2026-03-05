import { Typography } from 'antd'
import styles from './SettingsCard.module.scss'

const { Title } = Typography

interface SettingsCardProps {
  title: string
  children: React.ReactNode
}

export const SettingsCard = ({ title, children }: SettingsCardProps) => {
  return (
    <section className={styles.card}>
      <Title level={4} className={styles.title}>
        {title}
      </Title>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
