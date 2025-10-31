export type Review = {
  id: string
  author: string
  content: string
  date: string
}

export type Tag = {
  name: string
  count: number
}

export type BookDetails = {
  isbn: string[]
  publisher: string
  publishDate: string
  pages: number
  language: string
  format: string
  weight: string
  dimensions: string
}

export type BookCard = {
  id: string
  title: string
  author: string
  coverUrl: string
  rating: number
  ratingsCount: number
  publishYear: string
  availableQuantity: number
  price?: number
  discountPrice?: number
}

export type BookData = {
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
