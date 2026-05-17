import { ReactElement } from 'react'
import { ResponsiveContainer } from 'recharts'
import { ChartMeasure } from './ChartMeasure'

interface ChartBoxProps {
  className?: string
  minHeight?: number
  children: ReactElement
}

export const ChartBox = ({ className, minHeight, children }: ChartBoxProps) => (
  <ChartMeasure className={className} minHeight={minHeight}>
    {({ width, height }) => (
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    )}
  </ChartMeasure>
)
