import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { PieChartProps } from './types'

export const PieChart = ({
  data,
  colors,
  showTooltip = true,
  showLegend = false,
}: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart data={data}>
        {showTooltip && <Tooltip />}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          animationDuration={0}
          animationBegin={0}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors?.[index % (colors?.length ?? 1)]}
            />
          ))}
        </Pie>
        {showLegend && <Legend />}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
