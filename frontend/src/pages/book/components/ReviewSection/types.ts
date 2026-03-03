export interface Review {
  content: string
  id: string
  author?: string
  date: string
}

export interface ReviewSectionProps {
  tags: string[]
  bookId: string
}
