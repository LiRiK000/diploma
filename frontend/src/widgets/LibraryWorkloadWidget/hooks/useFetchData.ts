import { useQuery } from '@tanstack/react-query'

// TODO: Вынести в сервис
const libraryWorkloadService = {
  getLibraryWorkload: () => {
    return {
      booksInStock: 10,
      booksInOrder: 2,
      booksOverdue: 3,
    }
  },
}

export const useFetchData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['libraryWorkload'],
    queryFn: () => libraryWorkloadService.getLibraryWorkload(),
  })

  return { data, isLoading }
}
