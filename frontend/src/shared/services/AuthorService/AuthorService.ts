import { api } from '@shared/api'

export interface Author {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  dateOfDeath?: string | null
  booksCount?: number
}

export interface UpsertAuthorPayload {
  firstName: string
  lastName: string
  dateOfBirth: string
  dateOfDeath?: string | null
}

export class AuthorService {
  async getById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const response = await api.get(`/authors/${id}`)
    return response.data.data
  }

  async getAll(): Promise<Author[]> {
    const response = await api.get('/authors')
    const authors = response.data.data as Array<{
      id: string
      firstName: string
      lastName: string
      dateOfBirth: string
      dateOfDeath?: string | null
      _count?: { books: number }
    }>

    return authors.map(author => ({
      id: author.id,
      firstName: author.firstName,
      lastName: author.lastName,
      dateOfBirth: author.dateOfBirth,
      dateOfDeath: author.dateOfDeath ?? null,
      booksCount: author._count?.books,
    }))
  }

  async create(payload: UpsertAuthorPayload): Promise<Author> {
    const response = await api.post('/authors', payload)
    const data = response.data.data
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      dateOfDeath: data.dateOfDeath ?? null,
    }
  }

  async update(id: string, payload: UpsertAuthorPayload): Promise<Author> {
    const response = await api.put(`/authors/${id}`, payload)
    const data = response.data.data
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      dateOfDeath: data.dateOfDeath ?? null,
    }
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/authors/${id}`)
  }

  async toggleFollow(authorId: string) {
    const response = await api.post(`/authors/${authorId}/toggle-follow`)
    return response.data
  }
}
