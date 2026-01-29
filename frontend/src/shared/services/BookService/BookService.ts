import { api } from '@shared/api'
import { PaginatedBooksResponse } from './types'
import type { BookDto } from '@shared/services/Book/types'

export interface UpsertBookPayload {
  title: string
  authorId: string
  genreId: string
  availableQuantity?: number
  description?: string | null
  subjects?: string[]
  publisher?: string | null
  publishedDate?: string | null
  pageCount?: number | null
  language?: string | null
  coverImage?: string | null
}

export class BookService {
  async getPaginated(
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

  async getById(id: string): Promise<BookDto> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const response = await api.get(`/books/${id}`)
    return response.data.data
  }

  async searchBooks(query: string, take = 20) {
    const response = await api.get('/search/search', {
      params: { q: query, take },
    })
    return response.data.data
  }

  async getSuggestions(query: string, take = 8) {
    const response = await api.get('search/suggestions', {
      params: { q: query, take },
    })
    return response.data.data
  }

  async create(payload: UpsertBookPayload): Promise<BookDto> {
    const response = await api.post('/books', payload)
    return response.data.data
  }

  async update(id: string, payload: UpsertBookPayload): Promise<BookDto> {
    const response = await api.put(`/books/${id}`, payload)
    return response.data.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/books/${id}`)
  }
}
