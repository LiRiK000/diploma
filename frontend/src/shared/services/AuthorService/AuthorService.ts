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
  updatedAt?: string
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  dateOfDeath?: string | null
  booksCount?: number
  isFollowing?: boolean
  followersCount?: number
  topBooks?: AuthorBook[]
  photoUrl?: string | null
  _count?: any
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
  private mapAuthor(author: Author): Author {
    if (!author) return {} as Author
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
      photoUrl: author.photoUrl ?? null,
      updatedAt: author.updatedAt,
    }
  }

  async update(
    id: string,
    payload: UpsertAuthorPayload,
    file?: File,
  ): Promise<Author> {
    const response = await api.put(`/authors/${id}`, payload)
    const author = this.mapAuthor(response.data.data ?? response.data)

    if (file) {
      return this.uploadPhoto(id, file)
    }

    return author
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/authors/${id}`)
  }

  async getById(id: string): Promise<Author> {
    const response = await api.get(`/authors/${id}`)
    return this.mapAuthor(response.data.data)
  }

  async getAll(params?: GetAuthorsParams): Promise<Author[]> {
    const response = await api.get('/authors', { params })
    const data = response.data.data || []
    return data.map((author: Author) => this.mapAuthor(author))
  }

  async create(
    payload: UpsertAuthorPayload,
    file?: File,
  ): Promise<Author> {
    const response = await api.post('/authors', payload)
    const author = this.mapAuthor(response.data.data ?? response.data)

    if (file) {
      return this.uploadPhoto(author.id, file)
    }

    return author
  }

  async toggleFollow(authorId: string) {
    const response = await api.post(`/authors/${authorId}/toggle-follow`)
    return response.data
  }

  async bulkFollow(authorIds: string[]): Promise<void> {
    await api.post('/authors/bulk-follow', { authorIds })
  }
  async uploadPhoto(id: string, file: File): Promise<Author> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(`/authors/${id}/photo`, formData)
    return this.mapAuthor(response.data.data ?? response.data)
  }
}
