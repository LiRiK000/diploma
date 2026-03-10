import { api } from '@shared/api'

export interface AuthorBook {
  id: string
  title: string
  coverImage: string | null
  author: string
  genre: string
  availableQuantity: number
}

export interface Author {
  id: string
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  dateOfDeath?: string | null
  booksCount?: number
  isFollowing?: boolean
  followersCount?: number
  topBooks?: AuthorBook[]
}

export interface GetAuthorsParams {
  excludeIds?: string[]
  limit?: number
}

export interface UpsertAuthorPayload {
  firstName: string
  lastName: string
  dateOfBirth: string
  dateOfDeath?: string | null
}

export class AuthorService {
  private mapAuthor(author: any): Author {
    return {
      id: author.id,
      firstName: author.firstName,
      lastName: author.lastName,
      fullName: author.fullName || `${author.firstName} ${author.lastName}`,
      dateOfBirth: author.dateOfBirth,
      dateOfDeath: author.dateOfDeath ?? null,
      booksCount: author.booksCount ?? author._count?.books ?? 0,
      isFollowing: author.isFollowing ?? false,
      followersCount: author.followersCount ?? author._count?.followers ?? 0,
      topBooks: author.topBooks || [],
    }
  }

  async getById(id: string): Promise<Author> {
    const response = await api.get(`/authors/${id}`)
    return this.mapAuthor(response.data.data)
  }

  async getAll(params?: GetAuthorsParams): Promise<Author[]> {
    const response = await api.get('/authors', { params })

    const data = response.data.data || response.data
    return data.map((author: any) => this.mapAuthor(author))
  }

  async create(payload: UpsertAuthorPayload): Promise<Author> {
    const response = await api.post('/authors', payload)
    return this.mapAuthor(response.data.data)
  }

  async update(id: string, payload: UpsertAuthorPayload): Promise<Author> {
    const response = await api.put(`/authors/${id}`, payload)
    return this.mapAuthor(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/authors/${id}`)
  }

  async toggleFollow(authorId: string) {
    const response = await api.post(`/authors/${authorId}/toggle-follow`)
    return response.data
  }

  async bulkFollow(authorIds: string[]): Promise<void> {
    await api.post('/authors/bulk-follow', { authorIds })
  }
}
