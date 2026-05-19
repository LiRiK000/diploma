import React, { useState, useMemo } from 'react'
import {
  Drawer,
  Button,
  Input,
  Tag,
  Form,
  Select,
  InputNumber,
  Divider,
  Radio,
  Tooltip,
} from 'antd'

import {
  SearchOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DashboardOutlined,
  TableOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BgColorsOutlined,
} from '@ant-design/icons'

import {
  AVAILABLE_WIDGETS,
  AvailableWidgetInfo,
  WidgetRenderType,
} from '../../model/availableWidgets'

import styles from './WidgetConfigDrawer.module.scss'

interface WidgetConfigDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAddWidget: (widget: AvailableWidgetInfo, settings: any) => Promise<void>
}

const getRenderIcon = (type: WidgetRenderType) => {
  switch (type) {
    case 'line':
      return <LineChartOutlined />
    case 'bar':
      return <BarChartOutlined />
    case 'pie':
      return <PieChartOutlined />
    case 'kpi':
      return <DashboardOutlined />
    case 'table':
      return <TableOutlined />
    default:
      return <BarChartOutlined />
  }
}

export const WidgetConfigDrawer: React.FC<WidgetConfigDrawerProps> = ({
  isOpen,
  onClose,
  onAddWidget,
}) => {
  const [search, setSearch] = useState('')

  const [selectedWidget, setSelectedWidget] =
    useState<AvailableWidgetInfo | null>(null)

  const [form] = Form.useForm()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentRenderType = Form.useWatch('renderType', form)

  const filteredWidgets = useMemo(() => {
    return AVAILABLE_WIDGETS.filter(widget =>
      `${widget.title} ${widget.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
  }, [search])

  const handleSelectWidget = (widget: AvailableWidgetInfo) => {
    setSelectedWidget(widget)

    form.setFieldsValue({
      title: widget.title,
      renderType: widget.supportedRenderTypes[0]?.type || 'bar',
      range: 'MONTH',
      limit: widget.type === 'recent_orders' ? 5 : undefined,
      gridWidth: widget.defaultSize.w,
      gridHeight: widget.defaultSize.h,
    })
  }

  const handleRenderTypeChange = (type: WidgetRenderType) => {
    if (!selectedWidget) return

    if (type === 'table') {
      form.setFieldsValue({
        gridHeight: Math.max(3, selectedWidget.defaultSize.h - 1),
      })
    }

    if (type === 'pie') {
      form.setFieldsValue({
        gridHeight: Math.max(5, selectedWidget.defaultSize.h),
      })
    }

    if (type === 'kpi') {
      form.setFieldsValue({
        gridHeight: 2,
      })
    }
  }

  const handleBack = () => {
    setSelectedWidget(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    if (!selectedWidget) return

    try {
      const values = await form.validateFields()

      setIsSubmitting(true)

      const { title, gridWidth, gridHeight, ...settings } = values

      const updatedWidgetInfo = {
        ...selectedWidget,
        title,
        defaultSize: {
          w: Number(gridWidth),
          h: Number(gridHeight),
        },
      }

      await onAddWidget(updatedWidgetInfo, settings)

      handleBack()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer
      className={styles.drawer}
      title={
        <div className={styles.drawerTitle}>
          {selectedWidget ? (
            <>
              <BgColorsOutlined />
              Конфигурация виджета
            </>
          ) : (
            <>
              <AppstoreOutlined />
              Конструктор аналитики
            </>
          )}
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
      open={isOpen}
      destroyOnClose
      extra={
        selectedWidget && (
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Назад
          </Button>
        )
      }
      footer={
        selectedWidget ? (
          <div className={styles.footer}>
            <Button onClick={handleBack}>Отмена</Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={isSubmitting}
              onClick={handleSubmit}
              className={styles.submitButton}
            >
              Добавить на доску
            </Button>
          </div>
        ) : null
      }
    >
      {!selectedWidget ? (
        <div className={styles.galleryStep}>
          <div className={styles.searchWrapper}>
            <Input
              size="large"
              placeholder="Поиск аналитики..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.sidebarList}>
            {filteredWidgets.map(widget => (
              <div
                key={widget.type}
                className={styles.widgetCard}
                onClick={() => handleSelectWidget(widget)}
              >
                <div className={styles.widgetCardGlow} />

                <div className={styles.widgetHeader}>
                  <div>
                    <h3>{widget.title}</h3>
                    <p>{widget.description}</p>
                  </div>

                  <Tag color="blue">
                    {widget.defaultSize.w}×{widget.defaultSize.h}
                  </Tag>
                </div>

                <div className={styles.widgetFooter}>
                  {widget.supportedRenderTypes.map(t => (
                    <div key={t.type} className={styles.renderBadge}>
                      {getRenderIcon(t.type)}
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.configStep}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div>
                <h2>{selectedWidget.title}</h2>
                <p>{selectedWidget.description}</p>
              </div>

              <div className={styles.previewType}>
                {getRenderIcon(currentRenderType)}
              </div>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            className={styles.form}
          >
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <BgColorsOutlined />
                Визуализация
              </div>

              <Form.Item name="renderType" rules={[{ required: true }]}>
                <Radio.Group
                  className={styles.chartSelectorGroup}
                  onChange={e => handleRenderTypeChange(e.target.value)}
                >
                  {selectedWidget.supportedRenderTypes.map(renderOption => (
                    <Radio.Button
                      key={renderOption.type}
                      value={renderOption.type}
                      className={styles.chartSelectorItem}
                    >
                      <Tooltip title={renderOption.label}>
                        <div className={styles.chartSelectorContent}>
                          {getRenderIcon(renderOption.type)}

                          <span>{renderOption.label}</span>
                        </div>
                      </Tooltip>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>

            <Divider />

            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <SettingOutlined />
                Основные параметры
              </div>

              <Form.Item
                label="Название виджета"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'Введите название',
                  },
                ]}
              >
                <Input size="large" placeholder="Название аналитики" />
              </Form.Item>

              <div className={styles.gridInputs}>
                <Form.Item label="Ширина" name="gridWidth">
                  <InputNumber
                    min={2}
                    max={12}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label="Высота" name="gridHeight">
                  <InputNumber
                    min={2}
                    max={10}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </div>

              <Form.Item label="Интервал" name="range">
                <Select
                  size="large"
                  options={[
                    {
                      value: 'TODAY',
                      label: 'Сегодня',
                    },
                    {
                      value: 'WEEK',
                      label: 'Неделя',
                    },
                    {
                      value: 'MONTH',
                      label: 'Месяц',
                    },
                    {
                      value: 'YEAR',
                      label: 'Год',
                    },
                  ]}
                />
              </Form.Item>

              {selectedWidget.type === 'recent_orders' && (
                <Form.Item label="Лимит строк" name="limit">
                  <InputNumber
                    min={1}
                    max={20}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      )}
    </Drawer>
  )
}
