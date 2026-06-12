export type BookEditionValues = {
  publisher: string
  publishedDate: string
  pageCount: number
  language: string
  availableQuantity: number
  isbn?: string
  coverImage?: any
}

export type BookFormValues = {
  title: string
  authorId: string
  genreId: string
  description: string
  subjects?: string[]
  editions: BookEditionValues[]
}
