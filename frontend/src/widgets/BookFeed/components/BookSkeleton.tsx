import { Skeleton } from 'antd'
import { Props } from './types'
import styles from './styles.module.scss'

export const BookSkeleton = ({ count = 10 }: Props) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={styles.card}>
          <div className={styles.cover}></div>

          <div className={styles.content}>
            <Skeleton
              active
              title={{ width: '90%' }}
              paragraph={{
                rows: 1,
                width: '60%',
              }}
            />
            <Skeleton.Button
              active
              size="small"
              style={{ width: 80, marginTop: 8, borderRadius: 8 }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
