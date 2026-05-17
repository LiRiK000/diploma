import { FC } from 'react'
import { Space } from 'antd'
import { FullScreenButton } from '@entities/widgets-grid'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import styles from './LibrarianKpiWidget.module.scss'
import { useFetchData } from './hooks/useFetchData'

export const LIBRARIAN_KPI_WIDGET_ID = '1' as const

interface LibrarianKpiWidgetProps {
  isEditing?: boolean
  isDragging?: boolean
  isResizing?: boolean
}

export const LibrarianKpiWidget: FC<LibrarianKpiWidgetProps> = ({
  isEditing,
  isDragging,
  isResizing,
}) => {
  const { data, isLoading } = useFetchData()
  const overdueCount = data?.overdue ?? 0

  return (
    <WidgetWrapper
      id={LIBRARIAN_KPI_WIDGET_ID}
      title="Сводка по смене"
      subtitle="Показатели за сегодня"
      isLoading={isLoading}
      isEmpty={!data}
      emptyMessage="Нет данных"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      headerContent={
        <Space>
          <FullScreenButton widgetId={LIBRARIAN_KPI_WIDGET_ID} />
        </Space>
      }
    >
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.label}>Активные заявки</div>
          <div className={styles.value}>{data?.activeOrders ?? 0}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Выдано сегодня</div>
          <div className={styles.value}>{data?.issuedToday ?? 0}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Возвраты сегодня</div>
          <div className={styles.value}>{data?.returnsToday ?? 0}</div>
        </div>
        <div
          className={`${styles.card} ${overdueCount > 0 ? styles.cardDanger : ''}`}
        >
          <div className={styles.label}>Просрочено</div>
          <div className={styles.value}>{overdueCount}</div>
        </div>
      </div>
    </WidgetWrapper>
  )
}
