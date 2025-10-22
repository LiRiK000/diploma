export interface Review {
  content: string
  id: string
  author?: string
  date: string
}

interface Tag {
  name: string
  count: number
}

export interface ReviewSectionProps {
  reviews: Review[]
  tags: Tag[]
}
