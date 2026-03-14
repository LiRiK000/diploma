export interface LineChartPoint {
  name: string
  value: number
}

export interface LineChartProps {
  data: LineChartPoint[]
  stroke?: string
  showTooltip?: boolean
}
