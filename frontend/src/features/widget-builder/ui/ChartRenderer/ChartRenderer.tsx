import { ReactElement } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts'
import { ChartBox } from '@shared/components/ChartMeasure'
import type { WidgetType } from '../../model/useWidgetBuilderStore'
import type { ChartPoint } from '@widgets/LibrarianDashboardTab'
import styles from './ChartRenderer.module.scss'

const PALETTE = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF453A', '#5AC8FA']

const tooltipStyle = {
  borderRadius: 12,
  border: 'none',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  background: 'var(--bg-content)',
}

interface Props {
  type: WidgetType
  data: ChartPoint[]
  compact?: boolean
}

const wrapChart = (chart: ReactElement, compact?: boolean) => (
  <ChartBox className={styles.chart} minHeight={compact ? 160 : 120}>
    {chart}
  </ChartBox>
)

export const ChartRenderer = ({ type, data, compact }: Props) => {
  if (!data.length) {
    return <div className={styles.empty}>Нет данных за период</div>
  }

  if (type === 'bar') {
    return wrapChart(
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={compact ? 18 : 28}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>,
      compact,
    )
  }

  if (type === 'line') {
    return wrapChart(
      <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#007AFF"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>,
      compact,
    )
  }

  if (type === 'area') {
    return wrapChart(
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#007AFF" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34C759" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
        {data[0]?.returned !== undefined ? (
          <>
            <Area
              type="monotone"
              dataKey="issued"
              name="Выдано"
              stroke="#007AFF"
              fill="url(#areaBlue)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="returned"
              name="Возврат"
              stroke="#34C759"
              fill="url(#areaGreen)"
              strokeWidth={2}
            />
            {!compact && <Legend />}
          </>
        ) : (
          <Area
            type="monotone"
            dataKey="value"
            stroke="#007AFF"
            fill="url(#areaBlue)"
            strokeWidth={2}
          />
        )}
      </AreaChart>,
      compact,
    )
  }

  if (type === 'pie' || type === 'donut') {
    return wrapChart(
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={type === 'donut' ? (compact ? 36 : 52) : 0}
          outerRadius={compact ? 58 : 78}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>,
      compact,
    )
  }

  const radarData = data.map(d => ({
    subject: d.name,
    value: d.value,
    fullMark: Math.max(...data.map(x => x.value), 1),
  }))

  return wrapChart(
    <RadarChart
      cx="50%"
      cy="50%"
      outerRadius={compact ? '62%' : '72%'}
      data={radarData}
    >
      <PolarGrid stroke="rgba(0,0,0,0.08)" />
      <PolarAngleAxis
        dataKey="subject"
        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
      />
      <Radar
        dataKey="value"
        stroke="#AF52DE"
        fill="#AF52DE"
        fillOpacity={0.35}
        strokeWidth={2}
      />
      <Tooltip contentStyle={tooltipStyle} />
    </RadarChart>,
    compact,
  )
}
