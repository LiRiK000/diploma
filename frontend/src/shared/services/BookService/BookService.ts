import { api } from '@shared/api'
import { PaginatedBooksResponse } from './types'
import type { BookDto } from '@shared/services/Book/types'
import { Book } from '@entities/book/model/type'

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

export interface BookMainSection {
  id: string
  title: string
  slug: string
  items: Book[]
}

export interface Collection {
  id: string
  title: string
  slug: string
  description?: string
  order: number
  isActive: boolean
  books?: Book[]
  _count?: {
    books: number
  }
}

export interface UpsertCollectionPayload {
  title: string
  slug: string
  description?: string
  order?: number
  isActive?: boolean
  bookIds?: string[] // ID книг для связывания
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

  async getById(id: string): Promise<Book> {
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

  async getMainSections(): Promise<BookMainSection[]> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const response = await api.get('/books/main-sections')
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
  async uploadCover(bookId: string, formData: FormData) {
    return api.post(`/books/${bookId}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  async toggleFavorite(bookId: string) {
    await api.post(`/books/${bookId}/favorite`)
  }
  async getFavorites() {
    const response = await api.get('/books/favorites')
    return response.data.data
  }
  async addReview(bookId: string, text: string) {
    const response = await api.post('/reviews', {
      bookId,
      description: text,
    })
    return response.data.data
  }
  async getReviews(bookId: string) {
    const response = await api.get(`/reviews/book/${bookId}`)
    return response.data.data
  }
  async updateReview(reviewId: string, text: string) {
    const response = await api.patch(`/reviews/${reviewId}`, {
      description: text,
    })
    return response.data.data
  }
  async deleteReview(reviewId: string) {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data.data
  }

  async getAllCollections(): Promise<Collection[]> {
    const response = await api.get('/collections')
    return response.data
  }

  /** Получить одну коллекцию со списком книг (для редактирования) */
  async getCollectionById(id: string): Promise<Collection> {
    const response = await api.get(`/collections/${id}`)
    return response.data
  }

  /** Создать новую коллекцию */
  async createCollection(
    payload: UpsertCollectionPayload,
  ): Promise<Collection> {
    const response = await api.post('/collections', payload)
    return response.data
  }

  /** Обновить существующую коллекцию и её состав книг */
  async updateCollection(
    id: string,
    payload: UpsertCollectionPayload,
  ): Promise<Collection> {
    const response = await api.put(`/collections/${id}`, payload)
    return response.data
  }

  async deleteCollection(id: string): Promise<void> {
    await api.delete(`/collections/${id}`)
  }

  async getBooksForAdmin(params: { genreId?: string; search?: string }) {
    const response = await api.get('/catalog', {
      params: {
        page: 1,
        limit: 100,
        ...(params.genreId ? { genreId: params.genreId } : {}),
        ...(params.search ? { search: params.search } : {}),
      },
    })

    const items = response.data.items || []

    return items.map((book: any) => ({
      label: `${book.title} (${book.author})`,
      value: book.id,
    }))
  }
}
