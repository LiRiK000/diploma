import { useQuery } from '@tanstack/react-query'

export interface TopGenrePoint {
  name: string
  value: number
}

// TODO: Replace with real API service.
const topGenresService = {
  getTopGenres: async (): Promise<TopGenrePoint[]> => {
    return [
      { name: 'Фантастика', value: 42 },
      { name: 'Детектив', value: 31 },
      { name: 'Роман', value: 27 },
      { name: 'Научпоп', value: 19 },
      { name: 'История', value: 14 },
    ]
  },
}

export const useFetchData = () => {
  return useQuery({
    queryKey: ['topGenres', 'month'],
    queryFn: () => topGenresService.getTopGenres(),
  })
}
