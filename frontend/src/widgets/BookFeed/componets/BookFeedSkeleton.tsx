import { Col, Skeleton } from 'antd'
import { Props } from './types'

export const BookFeedSkeleton = ({ count = 8 }: Props) => {
  return Array.from({ length: count }).map((_, idx) => (
    <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${idx}`}>
      <Skeleton active paragraph={{ rows: 4 }} style={{ height: 250 }} />
    </Col>
  ))
}
