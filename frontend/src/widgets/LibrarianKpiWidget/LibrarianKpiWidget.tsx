import { Space } from 'antd'
import { FullScreenButton } from '@entities/widgets-grid'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import styles from './LibrarianKpiWidget.module.scss'
import { useFetchData } from './hooks/useFetchData'

export const LIBRARIAN_KPI_WIDGET_ID = '1' as const

export const LibrarianKpiWidget = () => {
  const { data, isLoading } = useFetchData()

  return (
    <WidgetWrapper
      title="Сводка по смене"
      isLoading={isLoading}
      isEmpty={!data}
      emptyMessage="Нет данных"
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
        <div className={styles.card}>
          <div className={styles.label}>Просрочено</div>
          <div className={styles.value}>{data?.overdue ?? 0}</div>
        </div>
      </div>
    </WidgetWrapper>
  )
}
