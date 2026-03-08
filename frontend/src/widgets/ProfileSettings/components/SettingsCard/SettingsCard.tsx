import { Typography } from 'antd'
import styles from './SettingsCard.module.scss'
import React from 'react'

const { Title } = Typography

interface SettingsCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const SettingsCard = ({
  title,
  children,
  className,
}: SettingsCardProps) => {
  return (
    <section className={`${styles.card} ${className || ''}`}>
      <Title level={4} className={styles.title}>
        {title}
      </Title>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
