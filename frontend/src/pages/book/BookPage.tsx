import styles from './BookPage.module.scss'
import { StickyHeader } from './componets/StickyHeader/StickyHeader'
import { HeroSection } from './componets/HeroSection/HeroSection'
import { BookContent } from './componets/BookContent/BookContent'
import { ReviewSection } from './componets/ReviewSection/ReviewSection'
import { BookSidebar } from './componets/BookSidebar/BookSidebar'
import { RecommendationBook } from '@widgets/RecommendationBook'
import { useBook } from './model/useBook'
import { HeroSectionSkeleton } from './componets/BookPageSkeleton/BookPageSkeleton'

export const BookPage = () => {
  const { book, isLoading, isError, showStickyHeader } = useBook()
  if (isLoading) return <HeroSectionSkeleton />
  if (isError) return <div>Ошибка загрузки</div>

  return (
    <div className={styles.page}>
      <StickyHeader
        title={book.title}
        author={book.author}
        coverUrl={book.coverUrl}
        isVisible={showStickyHeader}
      />
      <div className={styles.main}>
        <HeroSection {...book} />
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.mainContent}>
              <BookContent {...book} />
            </div>
            <div className={styles.sidebar}>
              <BookSidebar
                authorName={book.author}
                authorBio={book.authorBio}
              />
              <RecommendationBook books={book} />
            </div>
          </div>
        </div>
        <div className={styles.reviewSection}>
          <ReviewSection reviews={book.reviews} tags={book.tags} />
        </div>
      </div>
    </div>
  )
}
