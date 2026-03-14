import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChartProps } from './types'

export const BarChart = ({
  data,
  fill = '#0088FE',
  showTooltip = true,
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 12 }} />
        <YAxis tick={{ fill: '#fff', fontSize: 12 }} width={32} />
        {showTooltip && <Tooltip />}
        <Bar dataKey="value" fill={fill} isAnimationActive={false} radius={6} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

