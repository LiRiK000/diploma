import { Col, Skeleton } from 'antd'
import { Props } from './types'
import styles from './styles.module.scss'

export const BookSkeleton = ({ count = 8 }: Props) => {
  return Array.from({ length: count }).map((_, idx) => (
    <Col
      xs={24}
      sm={12}
      md={8}
      lg={6}
      key={`skeleton-${idx}`}
      className={styles.skeletonCol}
    >
      <Skeleton className={styles.skeleton} active paragraph={{ rows: 4 }} />
    </Col>
  ))
}
