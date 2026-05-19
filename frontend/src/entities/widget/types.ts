import { Layout } from 'react-grid-layout'

export interface DashboardWidget {
  id: string
  dashboardId: string
  key: string
  type: string
  title: string
  isEnabled: boolean
  order: number
  layout: Layout
  settings: Record<string, any> | null
  createdAt: string
  updatedAt: string
}

export interface Dashboard {
  id: string
  key: string
  title: string
  description: string | null
  widgets: DashboardWidget[]
  createdAt: string
  updatedAt: string
}

export interface UpdateLayoutItemPayload {
  id: string
  layout: Layout[]
}

export interface UpdateDashboardLayoutPayload {
  items: UpdateLayoutItemPayload[]
}
