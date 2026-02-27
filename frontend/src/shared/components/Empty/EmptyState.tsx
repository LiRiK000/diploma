import { Button, Typography, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import styles from './EmptyState.module.scss'

const { Title, Text } = Typography

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  onAction?: () => void
  actionText?: string
}

export const EmptyState = ({
  title = 'Ничего не найдено',
  description = 'Попробуйте изменить параметры поиска или сбросить фильтры',
  icon = <SearchOutlined />,
  onAction,
  actionText = 'Сбросить все фильтры',
}: EmptyStateProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.iconCircle}>{icon}</div>

        <Space direction="vertical" size={4} className={styles.textBlock}>
          <Title level={3} className={styles.title}>
            {title}
          </Title>
          <Text type="secondary" className={styles.description}>
            {description}
          </Text>
        </Space>

        {onAction && (
          <Button
            type="primary"
            size="large"
            icon={<ReloadOutlined />}
            onClick={onAction}
            className={styles.button}
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  )
}
