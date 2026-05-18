import {
  AdminOverviewResponse,
  IssuanceByGenreResponse,
  LibrarianKpiResponse,
  LibraryDynamicsResponse,
  OverdueAnalyticsResponse,
  StatsRangeQueryDto,
  UserSummaryResponse,
} from '@entities/statistic/model/types'
import { api } from '@shared/api'

export class StatisticService {
  async getAdminOverview(
    query: StatsRangeQueryDto,
  ): Promise<AdminOverviewResponse> {
    const response = await api.get<AdminOverviewResponse>(
      '/statistics/admin/overview',
      { params: query },
    )
    return response.data
  }

  async getAdminIssuanceByGenre(
    query: StatsRangeQueryDto,
  ): Promise<IssuanceByGenreResponse> {
    const response = await api.get<IssuanceByGenreResponse>(
      '/statistics/admin/issuance-by-genre',
      { params: query },
    )
    return response.data
  }

  async getAdminDynamics(
    query: StatsRangeQueryDto,
  ): Promise<LibraryDynamicsResponse> {
    const response = await api.get<LibraryDynamicsResponse>(
      '/statistics/admin/dynamics',
      { params: query },
    )
    return response.data
  }

  async getAdminOverdueAnalytics(
    query: StatsRangeQueryDto,
  ): Promise<OverdueAnalyticsResponse> {
    const response = await api.get<OverdueAnalyticsResponse>(
      '/statistics/admin/overdue-analytics',
      { params: query },
    )
    return response.data
  }

  async getAdminShiftKpi(
    query: StatsRangeQueryDto,
  ): Promise<LibrarianKpiResponse> {
    const response = await api.get<LibrarianKpiResponse>(
      '/statistics/admin/shift-kpi',
      { params: query },
    )
    return response.data
  }

  async getDynamicWidget(
    source: string,
    query: StatsRangeQueryDto,
  ): Promise<Array<{ name: string; value: number; issued?: number; returned?: number }>> {
    const response = await api.get('/statistics/admin/dynamic-widget', {
      params: { source, ...query },
    })
    return response.data
  }

  async getMeSummary(query: StatsRangeQueryDto): Promise<UserSummaryResponse> {
    const response = await api.get<UserSummaryResponse>(
      '/statistics/me/summary',
      { params: query },
    )
    return response.data
  }
}

export const statisticService = new StatisticService()
