import React from 'react'
import { Card } from 'antd'
import styles from './WidgetCard.module.scss'

interface WidgetCardProps {
  title: string
  extra?: React.ReactNode
  isLoading?: boolean
  children: React.ReactNode
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  extra,
  isLoading = false,
  children,
}) => {
  return (
    <Card
      title={title}
      extra={extra}
      loading={isLoading}
      className={styles.card}
      bordered={false}
    >
      {children}
    </Card>
  )
}
