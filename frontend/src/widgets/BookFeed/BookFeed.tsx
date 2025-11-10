import { Row, Col } from 'antd'
import { BookCard } from '@entities/book'
import { BookSkeleton } from './componets/BookSkeleton'
import { useBooks } from './hooks/useBooks'

export const BookFeed = () => {
  const { books, loadMoreRef, isError, isLoading, isFetchingNextPage } =
    useBooks()
  if (isError) return <div>Ошибка загрузки книг</div>
  return (
    <>
      <Row gutter={[16, 16]}>
        {isLoading && <BookSkeleton count={8} />}

        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <BookCard book={book} />
          </Col>
        ))}
        {isFetchingNextPage && <BookSkeleton count={8} />}
      </Row>
      <div ref={loadMoreRef} style={{ height: 50, visibility: 'hidden' }} />
    </>
  )
}
