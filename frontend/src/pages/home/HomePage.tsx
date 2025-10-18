import { BookCard, booksMock } from '@entities/book'
import { Row, Col } from 'antd'
import { Search } from '@features/search'

export const HomePage = () => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <Search />
      </div>
      <Row gutter={[16, 16]}>
        {booksMock.map(book => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
    </>
  )
}
