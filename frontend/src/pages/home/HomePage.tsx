import { Typography, Spin } from 'antd'
import { HomeCarousel } from './components/HomeCarousel/HomeCarousel'
import { BookSection } from '@widgets/BookSection'
import { useMainSections } from '@widgets/BookSection/hooks/useMainSections'
import styles from './HomePage.module.scss'

export const HomePage = () => {
  const { sections, isLoading, isError } = useMainSections()

  return (
    <div className={styles.container}>
      <HomeCarousel />

      <div className={styles.sectionsWrapper}>
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <Spin size="large" />
          </div>
        )}

        {isError && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Typography.Text type="danger">
              Не удалось загрузить рекомендации
            </Typography.Text>
          </div>
        )}

        {!isLoading &&
          sections.map(section => (
            <BookSection
              key={section.id}
              title={section.title}
              books={section.items}
              linkTo={`/catalog?collection=${section.slug}`}
            />
          ))}

        {!isLoading && sections.length === 0 && (
          <Typography.Text type="secondary">
            Здесь пока пусто...
          </Typography.Text>
        )}
      </div>
    </div>
  )
}
