import React from 'react'
import { LibrariansKpi } from '../ui/list/LibrariansKpi'
import { OverdueChart } from '../ui/list/OverdueChart'

export const widgetRegistry: Record<string, React.ComponentType<any>> = {
  librarians_kpi: LibrariansKpi,
  overdue_chart: OverdueChart,
}
