import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { booksApi } from '@shared/services/BookService/BookService'
import { HERO_SECTION_HEIGHT } from '@pages/book/constants'

export const useBook = () => {
  const { id } = useParams()
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id!),
  })

  useEffect(() => {
    const onScroll = () =>
      setShowStickyHeader(window.scrollY > HERO_SECTION_HEIGHT)

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { book, isLoading, isError, showStickyHeader }
}
