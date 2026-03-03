import { Skeleton } from 'antd'
import styles from './BookSkeleton.module.scss'

export const BookSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton.Button active block className={styles.coverSkeleton} />
      <Skeleton
        active
        paragraph={{ rows: 2, width: ['100%', '60%'] }}
        title={{ width: '85%' }}
      />
    </div>
  )
}
