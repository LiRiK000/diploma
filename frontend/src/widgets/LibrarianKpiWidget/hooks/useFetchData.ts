import { useQuery } from '@tanstack/react-query'

export interface LibrarianKpiData {
  activeOrders: number
  issuedToday: number
  returnsToday: number
  overdue: number
}

const librarianKpiService = {
  getKpi: async (): Promise<LibrarianKpiData> => {
    return {
      activeOrders: 18,
      issuedToday: 7,
      returnsToday: 5,
      overdue: 3,
    }
  },
}

export const useFetchData = () => {
  return useQuery({
    queryKey: ['librarianKpi'],
    queryFn: () => librarianKpiService.getKpi(),
  })
}
