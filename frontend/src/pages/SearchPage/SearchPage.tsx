import { useSearchParams } from 'react-router-dom'
import { Spin, Typography, Empty, Alert } from 'antd'
import { BookCard } from '@entities/book/ui/BookCard/BookCard'
import styles from './SearchPage.module.scss'
import { useSearch } from '@features/search/hooks/useSerch'

const { Title } = Typography
export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading, isError } = useSearch(query)

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Spin size="large" tip={`Ищем "${query}"...`} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <Alert
          message="Ошибка"
          description="Не удалось загрузить результаты поиска"
          type="error"
          showIcon
        />
      </div>
    )
  }

  // ТАК КАК ПРИХОДИТ МАССИВ:
  const books = Array.isArray(data) ? data : []

  const hasResults = books.length > 0

  if (!hasResults) {
    return (
      <div className={styles.emptyWrapper}>
        <Empty
          description={
            <span>
              По запросу <b>{query}</b> ничего не найдено
            </span>
          }
        />
      </div>
    )
  }

  return (
    <main className={styles.container}>
      <header className={styles.searchHeader}>
        <Title level={2} className={styles.title}>
          Результаты по запросу: {query}
        </Title>
      </header>

      <section className={styles.resultsGrid}>
        {books.map(book => (
          /* Убедись, что BookCard принимает объект именно с такими полями */
          <BookCard key={book.id} book={book} />
        ))}
      </section>
    </main>
  )
}
