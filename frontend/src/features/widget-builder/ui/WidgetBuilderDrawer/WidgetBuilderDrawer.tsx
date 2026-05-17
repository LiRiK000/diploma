import { Drawer, Input, Button, Typography, Tag } from 'antd'
import {
  BarChart3,
  LineChart,
  AreaChart,
  PieChart,
  Radar,
  Circle,
  Plus,
  Sparkles,
} from 'lucide-react'
import clsx from 'clsx'
import {
  useWidgetBuilderStore,
  WidgetType,
} from '../../model/useWidgetBuilderStore'
import {
  CHART_TYPE_OPTIONS,
  DATA_SOURCE_OPTIONS,
  RANGE_OPTIONS,
  SIZE_PRESET_OPTIONS,
  PLACEMENT_OPTIONS,
  getSizePreset,
  getSourceLabel,
} from '../../config/widgetOptions'
import { PreviewChart } from '../WidgetPreview/WidgetPreview'
import styles from './WidgetBuilderDrawer.module.scss'

const { Text, Title } = Typography

const CHART_ICONS: Record<WidgetType, typeof BarChart3> = {
  bar: BarChart3,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
  donut: Circle,
  radar: Radar,
}

export const WidgetBuilderDrawer = () => {
  const { config, isOpen, setOpen, updateConfig, save } =
    useWidgetBuilderStore()
  const size = getSizePreset(config.sizePreset)

  const compatibleSources = DATA_SOURCE_OPTIONS.filter(s =>
    s.compatibleTypes.includes(config.type),
  )

  const setType = (type: WidgetType) => {
    const sourceStillOk = DATA_SOURCE_OPTIONS.find(
      s => s.value === config.source && s.compatibleTypes.includes(type),
    )
    updateConfig({
      type,
      source: sourceStillOk ? config.source : compatibleSources[0]?.value,
    })
  }

  return (
    <Drawer
      title={null}
      placement="right"
      width={560}
      onClose={() => setOpen(false)}
      open={isOpen}
      className={styles.drawer}
      styles={{ body: { padding: 0 } }}
      footer={
        <div className={styles.footer}>
          <Button size="large" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={save}
            disabled={!config.title.trim()}
          >
            Добавить на дашборд
          </Button>
        </div>
      }
    >
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Sparkles size={20} />
        </div>
        <div>
          <Title level={4} className={styles.headerTitle}>
            Конструктор виджета
          </Title>
          <Text type="secondary">
            Соберите отчёт и выберите, куда он встанет
          </Text>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.previewSection}>
          <div className={styles.previewCard}>
            <div className={styles.previewMeta}>
              <Text strong>{config.title || 'Без названия'}</Text>
              <Tag color="processing">{getSourceLabel(config.source)}</Tag>
            </div>
            <PreviewChart config={config} />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>1. Название</h3>
          <Input
            size="large"
            placeholder="Например: Выдачи по жанрам"
            value={config.title}
            onChange={e => updateConfig({ title: e.target.value })}
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>2. Тип графика</h3>
          <div className={styles.optionGrid}>
            {CHART_TYPE_OPTIONS.map(opt => {
              const Icon = CHART_ICONS[opt.value]
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={clsx(
                    styles.optionCard,
                    config.type === opt.value && styles.optionCardActive,
                  )}
                  onClick={() => setType(opt.value)}
                >
                  <Icon size={22} strokeWidth={1.75} />
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={styles.optionDesc}>{opt.description}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>3. Данные</h3>
          <div className={styles.optionList}>
            {compatibleSources.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={clsx(
                  styles.listCard,
                  config.source === opt.value && styles.listCardActive,
                )}
                onClick={() => updateConfig({ source: opt.value })}
              >
                <span className={styles.listTitle}>{opt.label}</span>
                <span className={styles.listDesc}>{opt.description}</span>
              </button>
            ))}
          </div>
          <div className={styles.chipRow}>
            {RANGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={clsx(
                  styles.chip,
                  config.range === opt.value && styles.chipActive,
                )}
                onClick={() => updateConfig({ range: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>4. Размер</h3>
          <div className={styles.sizeRow}>
            {SIZE_PRESET_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={clsx(
                  styles.sizeChip,
                  config.sizePreset === opt.value && styles.sizeChipActive,
                )}
                onClick={() => updateConfig({ sizePreset: opt.value })}
              >
                <span>{opt.label}</span>
                <small>{opt.description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>5. Куда поставить</h3>
          <div className={styles.placementRow}>
            {PLACEMENT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={clsx(
                  styles.placementChip,
                  config.placement === opt.value && styles.placementChipActive,
                )}
                onClick={() => updateConfig({ placement: opt.value })}
                title={opt.description}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </Drawer>
  )
}
