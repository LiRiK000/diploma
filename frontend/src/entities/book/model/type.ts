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
  coverUrl: string
  publishYear: string
  ratingsCount: number
  description: string
  availableQuantity: number
  subjects: string[]
  details: BookDetails
  authorBio: string
  reviews: Review[]
  tags: Tag[]
  recommendedBooks: BookCard[]
}
