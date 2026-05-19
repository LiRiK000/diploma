import React, { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface GenreItem {
  name: string
  value: number
}

export const TopGenres: React.FC<{ data: GenreItem[] }> = React.memo(
  ({ data = [] }) => {
    const COLORS = useMemo(
      () => ['#1890ff', '#52c41a', '#722ed1', '#faad14', '#13c2c2', '#eb2f96'],
      [],
    )

    return (
      <div style={{ width: '100%', height: '100%', minHeight: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="35%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip
              contentStyle={{
                background: 'var(--glass-bg, rgba(255, 255, 255, 0.8))',
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingLeft: '4px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

TopGenres.displayName = 'TopGenres'
