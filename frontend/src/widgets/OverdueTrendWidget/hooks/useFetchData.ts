import { useQuery } from '@tanstack/react-query'

export interface OverdueTrendPoint {
  name: string
  value: number
}

// TODO: Replace with real API service.
const overdueTrendService = {
  getTrend: (): OverdueTrendPoint[] => {
    return [
      { name: 'Пн', value: 2 },
      { name: 'Вт', value: 3 },
      { name: 'Ср', value: 1 },
      { name: 'Чт', value: 4 },
      { name: 'Пт', value: 3 },
      { name: 'Сб', value: 2 },
      { name: 'Вс', value: 3 },
    ]
  },
}

export const useFetchData = () => {
  return useQuery({
    queryKey: ['overdueTrend', 'week'],
    queryFn: () => overdueTrendService.getTrend(),
  })
}
