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

export interface IReview {
  id: string
  userId: string
  bookId: string
  description: string
  createdAt: string
  updatedAt: string
  userName?: string
  userAvatar?: string | null
}
