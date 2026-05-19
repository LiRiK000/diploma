import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts'

interface TrendItem {
  name: string
  value: number
  issued: number
  returned: number
}

export const OverdueTrend: React.FC<{ data: TrendItem[] }> = React.memo(
  ({ data = [] }) => {
    const formattedData = data.map(item => ({
      ...item,
      shortDate: item.name
        ? item.name.split('-').slice(1).reverse().join('.')
        : '',
    }))

    return (
      <div style={{ width: '100%', height: '100%', minHeight: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--glass-border)"
              vertical={false}
              opacity={0.5}
            />
            <XAxis
              dataKey="shortDate"
              stroke="var(--text-secondary)"
              style={{ fontSize: '10px' }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-secondary)"
              style={{ fontSize: '10px' }}
              tickLine={false}
              allowDecimals={false}
            />
            <ChartTooltip
              contentStyle={{
                background: 'var(--glass-bg, rgba(255, 255, 255, 0.8))',
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
            />
            <Area
              type="monotone"
              dataKey="issued"
              name="Выдано"
              stroke="#1890ff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIssued)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

OverdueTrend.displayName = 'OverdueTrend'
