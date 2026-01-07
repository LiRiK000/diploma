import { api } from '@shared/api'
import { PaginatedBooksResponse } from './types'

export class BookService {
  static async getPaginated(
    cursor?: string | null,
    take = 8,
  ): Promise<PaginatedBooksResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const response = await api.get('/books', {
      params: {
        take,
        ...(cursor ? { cursor } : {}),
      },
    })
    return response.data.data
  }
  static async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500))

    const response = await api.get(`/books/${id}`)
    return response.data.data
  }
}
