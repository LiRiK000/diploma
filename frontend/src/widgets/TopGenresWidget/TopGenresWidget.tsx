import { FC, useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts'
import type { WidgetGridProps } from '@entities/widgets-grid/types'
import { toStatsQuery, DEFAULT_WIDGET_RANGE } from '@entities/statistic/lib/statsQuery'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { ChartBox } from '@shared/components/ChartMeasure'
import { useAdminIssuanceByGenre } from '@entities/statistic/hooks/useAdminIssuanceByGenre'
import {
  buildWidgetHeaderExtras,
  getWidgetRangeSubtitle,
} from '@widgets/LibrarianDashboardTab/model/widgetRangeProps'
import classes from './TopGenresWidget.module.scss'

export const TopGenresWidget: FC<WidgetGridProps> = props => {
  const { isEditing, isDragging, isResizing, rangeConfig, onRangeChange } =
    props

  const range = rangeConfig ?? DEFAULT_WIDGET_RANGE
  const statsQuery = useMemo(() => toStatsQuery(range), [range])
  const { data, isLoading } = useAdminIssuanceByGenre(statsQuery)
  const genres = data?.genres ?? []
  const isEmpty = !isLoading && genres.length === 0

  return (
    <WidgetWrapper
      id="4"
      title="Популярные жанры"
      subtitle={getWidgetRangeSubtitle(props, 'По количеству выдач')}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="Нет выдач за период"
      isEditing={isEditing}
      isDragging={isDragging}
      isResizing={isResizing}
      headerContent={buildWidgetHeaderExtras('4', {
        rangeConfig: range,
        onRangeChange,
        isEditing,
      }, { allowToday: false })}
    >
      <ChartBox className={classes.chartContainer}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={genres}>
          <defs>
            <radialGradient
              id="radarGradient"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#BF5AF2" stopOpacity={0.2} />
              <stop offset="80%" stopColor="#AF52DE" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#9433CD" stopOpacity={0.6} />
            </radialGradient>
          </defs>
          <PolarGrid />
          <PolarAngleAxis dataKey="label" tickSize={12} />
          <Radar
            name="Выдачи"
            dataKey="totalQuantity"
            stroke="#BF5AF2"
            strokeWidth={2}
            fill="url(#radarGradient)"
          />
        </RadarChart>
      </ChartBox>
    </WidgetWrapper>
  )
}
