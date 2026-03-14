import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LineChartProps } from './types'

export const LineChart = ({
  data,
  stroke = '#00C49F',
  showTooltip = true,
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: '#fff', fontSize: 12 }} />
        <YAxis tick={{ fill: '#fff', fontSize: 12 }} width={32} />
        {showTooltip && <Tooltip />}
        <Line
          type="monotone"
          dataKey="value"
          stroke={stroke}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

