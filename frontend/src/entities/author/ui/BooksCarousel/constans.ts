import { BookCardView } from '@entities/book/ui/BookCard/types'
const SLIDES_PER_PAGE = 3
export const mockBooks: BookCardView[] = [
  {
    id: '1',
    title: 'Преступление и наказание',
    author: 'Ф. М. Достоевский',
    genre: 'Роман',
    availableQuantity: 12,
    coverUrl: '/book.png',
    authorId: 'fe3aed40-0002-4719-a041-bb51da7e6a8a',
  },
  {
    id: '2',
    title: 'Идиот',
    author: 'Ф. М. Достоевский',
    genre: 'Классика',
    availableQuantity: 5,
    coverUrl: '/book.png',
  },
  {
    id: '3',
    title: 'Братья Карамазовы',
    author: 'Ф. М. Достоевский',
    genre: 'Философия',
    availableQuantity: 8,
    coverUrl: '/book.png',
  },
  {
    id: '4',
    title: 'Бесы',
    author: 'Ф. М. Достоевский',
    genre: 'Роман',
    availableQuantity: 3,
    coverUrl: '/book.png',
  },
  {
    id: '5',
    title: 'Игрок',
    author: 'Ф. М. Достоевский',
    genre: 'Классика',
    availableQuantity: 10,
    coverUrl: '/book.png',
  },
]
