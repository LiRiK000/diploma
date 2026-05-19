import React, { useMemo, useState } from 'react'
import { Modal, Button, Input, Tag } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

import {
  AVAILABLE_WIDGETS,
  AvailableWidgetInfo,
} from '../../model/availableWidgets'

import styles from './WidgetGalleryModal.module.scss'

interface WidgetGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onAddWidget: (widget: AvailableWidgetInfo) => void
}

const getWidgetSizeLabel = (w: number, h: number) => {
  if (w >= 6) return 'Large'
  if (w >= 4) return 'Medium'

  return 'Small'
}

export const WidgetGalleryModal: React.FC<WidgetGalleryModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
}) => {
  const [search, setSearch] = useState('')

  const filteredWidgets = useMemo(() => {
    return AVAILABLE_WIDGETS.filter(widget =>
      `${widget.title} ${widget.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
  }, [search])

  return (
    <Modal
      title="Добавление виджетов"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={960}
      centered
      className={styles.modal}
    >
      <div className={styles.topbar}>
        <Input
          placeholder="Поиск виджетов..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      <div className={styles.grid}>
        {filteredWidgets.map(widget => {
          const sizeLabel = getWidgetSizeLabel(
            widget.defaultSize.w,
            widget.defaultSize.h,
          )

          return (
            <div key={widget.type} className={styles.card}>
              <div className={styles.preview}>
                <div className={styles.previewGrid}>
                  {Array.from({
                    length: widget.defaultSize.w * widget.defaultSize.h,
                  }).map((_, i) => (
                    <div key={i} className={styles.previewCell} />
                  ))}
                </div>

                <Tag className={styles.sizeTag}>{sizeLabel}</Tag>
              </div>

              <div className={styles.content}>
                <div className={styles.title}>{widget.title}</div>

                <div className={styles.description}>{widget.description}</div>

                <div className={styles.meta}>
                  <span>
                    {widget.defaultSize.w} × {widget.defaultSize.h}
                  </span>
                </div>
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.addButton}
                onClick={() => onAddWidget(widget)}
              >
                Добавить
              </Button>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
