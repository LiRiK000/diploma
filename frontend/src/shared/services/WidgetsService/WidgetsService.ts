import { api } from '@shared/api'
import { Layout } from 'react-grid-layout'
import {
  Dashboard,
  DashboardWidget,
  UpdateDashboardLayoutPayload,
} from '@entities/widget/types'
import { StatsRangeQueryDto } from '@entities/statistic/model/types'

export class DashboardService {
  private mapWidget(widget: any): DashboardWidget {
    if (!widget) return {} as DashboardWidget

    const parsedLayout =
      typeof widget.layout === 'string'
        ? JSON.parse(widget.layout)
        : widget.layout

    return {
      id: widget.id,
      dashboardId: widget.dashboardId,
      key: widget.key,
      type: widget.type,
      title: widget.title,
      isEnabled: widget.isEnabled ?? true,
      order: widget.order ?? 0,
      layout: {
        ...parsedLayout,
        i: parsedLayout?.i || widget.id,
      } as Layout,
      settings: widget.settings || null,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
    }
  }

  private mapDashboard(dashboard: any): Dashboard {
    if (!dashboard) return {} as Dashboard
    return {
      id: dashboard.id,
      key: dashboard.key,
      title: dashboard.title,
      description: dashboard.description ?? null,
      widgets: Array.isArray(dashboard.widgets)
        ? dashboard.widgets.map((w: any) => this.mapWidget(w))
        : [],
      createdAt: dashboard.createdAt,
      updatedAt: dashboard.updatedAt,
    }
  }

  async createWidget(payload: any): Promise<DashboardWidget> {
    const response = await api.post('/dashboard-widgets', payload)
    const data = response.data.data || response.data
    return this.mapWidget(data)
  }

  async removeWidget(id: string): Promise<{ id: string }> {
    const response = await api.delete(`/dashboard-widgets/${id}`)
    return response.data.data || response.data
  }
  async getByKey(key: string): Promise<Dashboard> {
    const response = await api.get(`/dashboard-widgets/dashboard/${key}`)
    const data = response.data.data || response.data
    return this.mapDashboard(data)
  }

  async updateLayout(
    payload: UpdateDashboardLayoutPayload,
  ): Promise<{ success: boolean }> {
    const response = await api.patch('/dashboard-widgets/layout/all', payload)
    return response.data
  }

  async toggleWidget(id: string): Promise<DashboardWidget> {
    const response = await api.patch(`/dashboard-widgets/${id}/toggle`)
    const data = response.data.data || response.data
    return this.mapWidget(data)
  }

  async getWidgetData(id: string, query: StatsRangeQueryDto): Promise<any> {
    const response = await api.get(`/dashboard-widgets/${id}/data`, {
      params: query,
    })

    return response.data.data || response.data
  }
}

export const dashboardService = new DashboardService()
