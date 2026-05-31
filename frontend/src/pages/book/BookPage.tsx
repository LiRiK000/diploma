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

  if (isLoading) return <HeroSectionSkeleton />
  if (isError) return <div className={styles.errorState}>Ошибка загрузки</div>
  if (!book) return null

  return (
    <div className={styles.page}>
      <StickyHeader
        id={book.id}
        title={book.title}
        author={book.author}
        coverUrl={book.coverUrl}
        isVisible={showStickyHeader}
      />

      <main
        className={`${styles.main} ${showStickyHeader ? styles.withStickyHeader : ''}`}
      >
        <HeroSection {...book} />

        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.mainContent}>
              <BookContent {...book} />
            </div>

            <aside className={styles.sidebar}>
              <BookSidebar
                authorName={book.author}
                authorBio={book.authorBio}
                authorId={book.authorId}
              />
              <RecommendationBook books={book} />
            </aside>
          </div>

          <section className={styles.reviewSection}>
            <ReviewSection bookId={book.id} tags={book.tags} />
          </section>
        </div>
      </main>
    </div>
  )
}
