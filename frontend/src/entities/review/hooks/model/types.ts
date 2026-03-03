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
  user: { name: string; surname: string }
}
