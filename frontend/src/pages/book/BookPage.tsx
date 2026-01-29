import styles from './BookPage.module.scss'
import { StickyHeader } from './components/StickyHeader'
import { HeroSection } from './components/HeroSection'
import { BookContent } from './components/BookContent'
import { ReviewSection } from './components/ReviewSection'
import { BookSidebar } from './components/BookSidebar'
import { HeroSectionSkeleton } from './components/BookPageSkeleton'
import { RecommendationBook } from '@widgets/RecommendationBook'
import { useBook } from './model/useBook'

export const BookPage = () => {
  const { book, isLoading, isError, showStickyHeader } = useBook()
  console.log(book)

  if (isLoading) return <HeroSectionSkeleton />
  if (isError) return <div>Ошибка загрузки</div>

  return (
    <div className={styles.page}>
      <StickyHeader
        id={book.id}
        title={book.title}
        author={book.author}
        coverUrl="/book.png"
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
                authorId={book.authorId}
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
