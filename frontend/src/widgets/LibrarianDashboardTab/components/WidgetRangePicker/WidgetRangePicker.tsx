import { FC, useState } from 'react'
import { DatePicker, Select, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { WidgetRangeConfig } from '@entities/statistic/lib/statsQuery'
import { WIDGET_RANGE_OPTIONS } from '@entities/statistic/lib/statsQuery'
import styles from './WidgetRangePicker.module.scss'

interface Props {
  value: WidgetRangeConfig
  onChange: (next: WidgetRangeConfig) => void
  compact?: boolean
  allowToday?: boolean
}

export const WidgetRangePicker: FC<Props> = ({
  value,
  onChange,
  compact,
  allowToday = true,
}) => {
  const [open, setOpen] = useState(false)

  const options = WIDGET_RANGE_OPTIONS.filter(
    o => allowToday || o.value !== 'today',
  )

  const handlePreset = (preset: WidgetRangeConfig['preset']) => {
    if (preset === 'custom') {
      onChange({
        preset: 'custom',
        from: value.from ?? dayjs().subtract(30, 'day').toISOString(),
        to: value.to ?? dayjs().toISOString(),
      })
      setOpen(true)
      return
    }
    onChange({ preset })
    setOpen(false)
  }

  const handleDates = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates?.[0] || !dates?.[1]) return
    onChange({
      preset: 'custom',
      from: dates[0].startOf('day').toISOString(),
      to: dates[1].endOf('day').toISOString(),
    })
  }

  return (
    <Space
      size={compact ? 4 : 8}
      className={styles.root}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    >
      <Select
        size="small"
        className={styles.select}
        popupMatchSelectWidth={false}
        value={value.preset}
        options={options}
        onChange={handlePreset}
        onClick={e => e.stopPropagation()}
      />
      {value.preset === 'custom' && (
        <DatePicker.RangePicker
          size="small"
          open={open}
          onOpenChange={setOpen}
          value={
            value.from && value.to
              ? [dayjs(value.from), dayjs(value.to)]
              : undefined
          }
          onChange={handleDates}
          format="DD.MM.YY"
          allowClear={false}
        />
      )}
    </Space>
  )
}
