import { Book } from '@entities/book/model/type'

export interface Author {
  firstName: string
  lastName: string
  dateOfBirth: string
  dateOfDeath?: string
  biography: string
  isFollowing: boolean
  followersCount: number
  id: string
  books: Book[]
  _count: {
    followers: number
  }
}

export interface AuthorHeroSectionProps {
  author: Author
}
