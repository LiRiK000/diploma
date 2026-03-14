export interface BarChartPoint {
  name: string
  value: number
}

export interface BarChartProps {
  data: BarChartPoint[]
  fill?: string
  showTooltip?: boolean
}
