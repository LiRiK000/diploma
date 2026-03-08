import { BookCard, BookDetails } from '@pages/book/type'

export interface Author {
  id: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export type Tag = {
  name: string
  count: number
}
export type Review = {
  id: string
  author: string
  content: string
  date: string
}
export interface Book {
  id: string
  title: string
  author: string
  authorId: string
  coverUrl: string
  publishYear: number
  ratingsCount: number
  description: string
  availableQuantity: number
  subjects: string[]
  details: BookDetails
  authorBio: string
  reviews: Review[]
  tags: string[]
  recommendedBooks: BookCard[]
}

export type CatalogSort = 'newest' | 'oldest' | 'alphabetical'

export interface GetCatalogParams {
  page?: number
  limit?: number
  genreId?: string
  authorId?: string
  search?: string
  sort?: CatalogSort
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CatalogResponse {
  items: Book[]
  pagination: PaginationInfo
}
