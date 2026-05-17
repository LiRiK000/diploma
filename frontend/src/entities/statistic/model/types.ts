export interface StatsRangeQueryDto {
  from?: string
  to?: string
}

export interface AdminOverviewResponse {
  range: { from: string; to: string }
  newUsersInRange: number
  ordersInRange: number
  orderItemsQuantitySum: number
  reviewsInRange: number
  booksTotalCatalog: number
  ordersByStatus: Array<{
    status: string
    count: number
  }>
}

export interface GenreStatRow {
  id: string
  label: string
  value: string
  totalQuantity: number
  distinctOrders: number
}

export interface IssuanceByGenreResponse {
  range: { from: string; to: string }
  genres: GenreStatRow[]
}

export interface UserSummaryResponse {
  range: { from: string; to: string }
  ordersCount: number
  booksBorrowedDistinct: number
  totalItemsQuantity: number
  reviewsWritten: number
  favoriteGenresCount: number
}
export interface LibraryDynamicRow {
  date: string
  issued: number
  returned: number
}

export interface LibraryDynamicsResponse {
  data: LibraryDynamicRow[]
}

export interface OverdueStatRow {
  label: string
  value: number
}

// Тип ответа - это просто массив строк статистики
export type OverdueAnalyticsResponse = OverdueStatRow[]
