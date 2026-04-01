import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'

const MOCK_DATA = [
  { name: 'Пн', value: 40 },
  { name: 'Вт', value: 70 },
  { name: 'Ср', value: 45 },
  { name: 'Чт', value: 90 },
  { name: 'Пт', value: 65 },
]

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']

export const PreviewChart = ({ type }: { type: string }) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart
            data={MOCK_DATA}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                background: 'var(--bg-content)',
                border: '1px solid var(--glass-border)',
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--ant-primary-color)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart
            data={MOCK_DATA}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--ant-primary-color)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--ant-primary-color)' }}
            />
          </LineChart>
        )
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={MOCK_DATA}
              innerRadius="60%"
              outerRadius="80%"
              dataKey="value"
              stroke="none"
              paddingAngle={5}
              cx="50%"
              cy="50%"
            >
              {MOCK_DATA.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
      default:
        return null
    }
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={100}>
      {renderChart()}
    </ResponsiveContainer>
  )
}
