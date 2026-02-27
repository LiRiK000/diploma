import { genreService } from '@shared/services/GenreService'
import { useQuery } from '@tanstack/react-query'

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => genreService.getAll(),
  })
}
