export interface BookOption {
  label: string
  value: string
}

export interface CollectionRecord {
  id: string
  title: string
  slug: string
  description?: string | null
  order: number
  isActive: boolean
  createdAt: Record<string, unknown> | string
  updatedAt: Record<string, unknown> | string
  books: Array<{
    id: string
    title: string
    author: { firstName: string; lastName: string } | null
  }>
  _count?: {
    books: number
  }
}

export interface CollectionFormValues {
  title: string
  slug: string
  isActive: boolean
  bookIds: string[]
}
