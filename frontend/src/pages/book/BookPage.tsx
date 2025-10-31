import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { StickyHeader } from './componets/StickyHeader/StickyHeader'
import { HeroSection } from './componets/HeroSection/HeroSection'
import { BookContent } from './componets/BookContent/BookContent'
import { ReviewSection } from './componets/ReviewSection/ReviewSection'
import { BookSidebar } from './componets/BookSidebar/BookSidebar'
import { bookData, HERO_SECTION_HEIGHT } from './constants'
import styles from './BookPage.module.scss'
import { RecommendationBook } from '@widgets/RecommendationBook'

export const BookPage = () => {
  const { id } = useParams()
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const book = bookData

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > HERO_SECTION_HEIGHT)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={styles.page}>
      <StickyHeader
        title={book.title}
        author={book.author}
        coverUrl={book.coverUrl}
        isVisible={showStickyHeader}
      />
      <div className={styles.main}>
        <div className={styles.HeroSection}></div>
        <HeroSection
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
          publishYear={book.publishYear}
          ratingsCount={book.ratingsCount}
          availableQuantity={book.availableQuantity}
        />
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.mainContent}>
              <BookContent
                description={book.description}
                subjects={book.subjects}
                details={book.details}
              />
            </div>
            <div className={styles.sidebar}>
              <BookSidebar
                authorName={book.author}
                authorBio={book.authorBio}
              />
              <RecommendationBook books={book.recommendedBooks} />
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
