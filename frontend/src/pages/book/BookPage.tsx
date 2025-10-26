import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { StickyHeader } from './componets/StickyHeader/StickyHeader'
import { HeroSection } from './componets/HeroSection/HeroSection'
import { BookContent } from './componets/BookContent/BookContent'
import { ReviewSection } from './componets/ReviewSection/ReviewSection'
import { BookSidebar } from './componets/BookSidebar/BookSidebar'
import { bookData, heroSectionHeight } from './constants'
import styles from './BookPage.module.scss'
import { RecommendationBook } from '@widgets/RecommendationBook/RecommendationBook'

export const BookPage = () => {
  const { id } = useParams()
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > heroSectionHeight)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const book = bookData

  return (
    <div className={styles.page}>
      <StickyHeader
        title={book.title}
        author={book.author}
        coverUrl={book.coverUrl}
        isVisible={showStickyHeader}
      />

      <div className={styles.main}>
        <HeroSection
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
          publishYear={book.publishYear}
          rating={book.rating}
          ratingsCount={book.ratingsCount}
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
