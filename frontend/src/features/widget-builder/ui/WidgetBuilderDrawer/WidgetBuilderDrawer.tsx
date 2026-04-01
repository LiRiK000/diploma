import {
  Drawer,
  Input,
  Select,
  Segmented,
  Space,
  Button,
  Typography,
  Divider,
} from 'antd'
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useWidgetBuilderStore } from '../../model/useWidgetBuilderStore'
import styles from './WidgetBuilderDrawer.module.scss'
import { PreviewChart } from '../WidgetPreview/WidgetPreview'

const { Text, Title } = Typography

export const WidgetBuilderDrawer = () => {
  const { config, isOpen, setOpen, updateConfig, save } =
    useWidgetBuilderStore()

  return (
    <Drawer
      title={
        <Title level={4} style={{ margin: 0 }}>
          Конструктор виджета
        </Title>
      }
      placement="right"
      width={500}
      onClose={() => setOpen(false)}
      open={isOpen}
      className={styles.drawer}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)} type="text">
            Отмена
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={save}>
            Добавить на дашборд
          </Button>
        </Space>
      }
    >
      <div className={styles.content}>
        <div className={styles.previewCard}>
          <Text strong className={styles.previewTitle}>
            {config.title || 'Предпросмотр'}
          </Text>
          <PreviewChart type={config.type} />
        </div>
        <Divider />
        <div className={styles.form}>
          <div className={styles.field}>
            <label>Название</label>
            <Input
              placeholder="Напр. Топ жанров"
              value={config.title}
              onChange={e => updateConfig({ title: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label>Тип графика</label>
            <Segmented
              block
              value={config.type}
              onChange={val => updateConfig({ type: val as any })}
              options={[
                { label: 'Бар', value: 'bar', icon: <BarChartOutlined /> },
                { label: 'Линии', value: 'line', icon: <LineChartOutlined /> },
                { label: 'Пирог', value: 'pie', icon: <PieChartOutlined /> },
              ]}
            />
          </div>
          <div className={styles.field}>
            <label>Источник данных</label>
            <Select
              style={{ width: '100%' }}
              value={config.source}
              onChange={val => updateConfig({ source: val })}
              options={[
                { label: 'Популярные жанры', value: 'popular_genres' },
                { label: 'Топ авторов', value: 'popular_authors' },
              ]}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
