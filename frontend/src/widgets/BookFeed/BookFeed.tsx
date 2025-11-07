import { Row, Col } from 'antd'
import { BookCard } from '@entities/book'
import { BookFeedSkeleton } from './componets/BookFeedSkeleton'
import { useBooks } from './model/useBooks'

export const BookFeed = () => {
  const { books, loadMoreRef, isError, isLoading, isFetchingNextPage } =
    useBooks()

  if (isError) return <div>Ошибка загрузки книг</div>

  return (
    <>
      <Row gutter={[16, 16]}>
        {books.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <BookCard book={book} />
          </Col>
        ))}

        {isLoading && <BookFeedSkeleton count={8} />}
        {isFetchingNextPage && <BookFeedSkeleton count={8} />}
      </Row>

      <div ref={loadMoreRef} style={{ height: 50 }} />
    </>
  )
}
