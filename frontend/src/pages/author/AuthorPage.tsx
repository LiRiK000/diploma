import { AuthorHeroSection } from '@entities/author/ui/AuthorHeroSection/AuthorHeroSection'
import { BooksCarousel } from '@entities/author/ui/BooksCarousel/BooksCarousel'
import styles from './AuthorPage.module.scss'
import { useAuthor } from '@entities/author/hooks/useAuthor'

export const AuthorPage = () => {
  const { author, isLoading, isError } = useAuthor()

  if (isLoading) return <div>Загрузка...</div>
  if (isError) return <div>Ошибка загрузки</div>

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <AuthorHeroSection author={author!} />
        <BooksCarousel title="Популярные книги" />
      </div>
    </div>
  )
}
