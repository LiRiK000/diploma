import { api } from '@shared/api'
import { PaginatedBooksResponse } from './types'

export const booksApi = {
  async getPaginated(
    cursor?: string | null,
    take = 8,
  ): Promise<PaginatedBooksResponse> {
    const params = new URLSearchParams()
    params.append('take', take.toString())
    if (cursor) params.append('cursor', cursor)
    const res = await api.get(`/books?${params.toString()}`)
    await new Promise(resolve => setTimeout(resolve, 400))
    return res.data.data
  },
  async getById(id: string) {
    const res = await api.get(`/books/${id}`)
    return res.data.data
  },
}
