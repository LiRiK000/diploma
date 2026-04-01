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
  { name: 'Пн', value: 400 },
  { name: 'Вт', value: 300 },
  { name: 'Ср', value: 500 },
  { name: 'Чт', value: 280 },
  { name: 'Пт', value: 590 },
]

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']

export const PreviewChart = ({ type }: { type: string }) => {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={MOCK_DATA}
          margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.1)"
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
              borderRadius: '12px',
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
      </ResponsiveContainer>
    )
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <LineChart
          data={MOCK_DATA}
          margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.1)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--ant-primary-color)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--ant-primary-color)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={MOCK_DATA}
          innerRadius={45}
          outerRadius={65}
          dataKey="value"
          stroke="none"
        >
          {MOCK_DATA.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
