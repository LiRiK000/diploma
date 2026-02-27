export type CatalogSort = 'newest' | 'oldest' | 'title'

export interface GetCatalogParams {
  page?: number
  limit?: number
  genreId?: string
  authorId?: string
  search?: string
  sort?: CatalogSort
}

export interface CatalogBook {
  id: string
  title: string

  author: string
  authorId: string

  genre: string
  genreId: string

  coverUrl: string

  availableQuantity: number

  description: string
}

export interface CatalogResponse {
  items: CatalogBook[]

  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
