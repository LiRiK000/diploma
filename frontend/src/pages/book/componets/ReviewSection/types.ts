export interface Review {
  content: string
  id: string
  author?: string
  date: string
}

export interface ReviewSectionProps {
  reviews: Review[]
  tags: []
}
