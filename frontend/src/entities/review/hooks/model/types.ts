export interface IReviewCardProps {
  review: IReviewCard
  onDelete?: (id: string) => void
  isOwn: boolean
}

export interface IReviewCard {
  id: string
  userId: string
  bookId: string
  description: string
  createdAt: string
  updatedAt: string
  user: { name: string; surname: string }
  deleteReview?: (id: string) => void
}
