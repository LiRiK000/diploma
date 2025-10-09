import { Row, Col } from 'antd'
import { BookCard } from '../../entities/book/ui/index'
import { booksMock } from '../../entities/book/data'

export const HomePage = () => {
  return (
    <Row gutter={[16, 16]}>
      {booksMock.map(book => (
        <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
          <BookCard book={book} onAddToCart={() => {}} />
        </Col>
      ))}
    </Row>
  )
}
