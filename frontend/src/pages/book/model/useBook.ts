import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookService } from '@shared/services/BookService'
import { HERO_SECTION_HEIGHT } from '@pages/book/constants'
import { Book } from '@entities/book/model/type'

export const useBook = () => {
  const { id } = useParams<{ id: string }>()
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery<Book>({
    queryKey: ['book', id],
    queryFn: () => bookService.getById(id!),
    enabled: !!id,
  })

  useEffect(() => {
    const onScroll = () =>
      setShowStickyHeader(window.scrollY > HERO_SECTION_HEIGHT)

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return {
    book,
    isLoading,
    isError,
    showStickyHeader,
  }
}
