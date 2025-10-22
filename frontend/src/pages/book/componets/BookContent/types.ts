export interface BookContentProps {
  description: string
  subjects: string[]
  details: {
    isbn: string[]
    publisher: string
    publishDate: string
    pages: number
    language: string
    format: string
    weight: string
    dimensions: string
  }
}
