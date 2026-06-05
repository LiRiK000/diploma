import { Typography } from 'antd'
import { HomeCarousel } from './components/HomeCarousel/HomeCarousel'
import { BookSection } from '@widgets/BookSection'
import { useMainSections } from '@widgets/BookSection/hooks/useMainSections'
import { BookSkeleton } from '@widgets/BookFeed/components/BookSkeleton'
import styles from './HomePage.module.scss'
import { BookFeed } from '@widgets/BookFeed'

export const HomePage = () => {
  const { sections, isLoading, isError } = useMainSections()

  return (
    <div className={styles.container}>
      <HomeCarousel />
      <div className={styles.sectionsWrapper}>
        {isLoading && (
          <div className={styles.skeletonContainer}>
            <BookSkeleton count={10} />
          </div>
        )}

        {isError && (
          <div className={styles.statusBlock}>
            <Typography.Text type="danger" className={styles.errorText}>
              Не удалось загрузить рекомендации. Пожалуйста, обновите страницу.
            </Typography.Text>
          </div>
        )}

        {!isLoading &&
          !isError &&
          sections.map(section => (
            <div key={section.id} className={styles.feedSection}>
              <BookSection
                variant="winter"
                title={section.title}
                books={section.items}
                linkTo={`/catalog?collection=${section.slug}`}
              />
            </div>
          ))}

        {!isLoading && !isError && sections.length === 0 && (
          <div className={styles.statusBlock}>
            <Typography.Text type="secondary" className={styles.emptyText}>
              Здесь пока пусто...
            </Typography.Text>
          </div>
        )}

        <BookFeed />
      </div>
    </div>
  )
}
