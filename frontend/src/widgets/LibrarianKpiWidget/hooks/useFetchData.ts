import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/api'

export interface LibrarianKpiData {
  activeOrders: number
  issuedToday: number
  returnsToday: number
  overdue: number
}

export const useFetchData = () => {
  return useQuery({
    queryKey: ['librarian-shift-kpi'],
    queryFn: async () => {
      const { data } = await api.get<LibrarianKpiData>('/statistics/admin/shift-kpi')
      return data
    },
    staleTime: 60_000,
  })
}
