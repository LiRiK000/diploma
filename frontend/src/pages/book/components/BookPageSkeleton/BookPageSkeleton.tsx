import { Skeleton } from 'antd'
import styles from './BookPageSkeleton.module.scss'
// TODO ВЫНЕСТИ IN_LINE стили
export const HeroSectionSkeleton = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <Skeleton.Input
          active
          style={{ width: 220, height: 320, borderRadius: 8 }}
        />
        <div className={styles.info}>
          <Skeleton.Input
            active
            style={{ width: '60%', height: 32, marginBottom: 12 }}
          />
          <Skeleton.Input
            active
            style={{ width: '40%', height: 20, marginBottom: 20 }}
          />
          <Skeleton
            paragraph={{
              rows: 2,
              width: ['80%', '60%'],
              style: { marginBottom: 20 },
            }}
            active
          />
          <div className={styles.actions}>
            <Skeleton.Button
              active
              style={{ width: 140, height: 40, marginRight: 12 }}
            />
            <Skeleton.Button
              active
              style={{ width: 140, height: 40, marginRight: 12 }}
            />
            <Skeleton.Button active style={{ width: 140, height: 40 }} />
          </div>
        </div>
      </div>
    </section>
  )
}
