import { Book } from '@entities/book/model/type'

export interface Author {
  id: string
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  dateOfDeath?: string | null
  avatar?: string
  isFollowing: boolean
  followersCount: number
  topBooks: Book[]
  _count: {
    followers: number
  }
  createdAt: string
  updatedAt: string
}

export interface AuthorHeroSectionProps {
  author: Author
}
