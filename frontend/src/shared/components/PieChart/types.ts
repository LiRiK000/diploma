export interface PieChartProps {
  data: { name: string; value: number }[]
  colors?: string[]
  size?: number
  showTooltip?: boolean
  showLegend?: boolean
}
