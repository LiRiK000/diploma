import {
  Select,
  Pagination,
  Space,
  Typography,
  Button,
  Breadcrumb,
  ConfigProvider,
} from 'antd'
import { useCatalog } from '@entities/book/hooks/useCatalog'
import { useAuthors } from './hooks/useAuthors'
import { BookCard } from '@entities/book'
import { useGenres } from './hooks/useGenres'
import styles from './CatalogWidget.module.scss'
import { useCatalogFilters } from './hooks/useCatalogFilters'
import { EmptyState } from '@shared/components/Empty/EmptyState'
import { BookSkeleton } from './components/BookSkeleton/BookSkeleton'
import { Link } from 'react-router-dom'
import { CloseOutlined, FilterOutlined, SwapOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export const CatalogWidget = () => {
  const { filters, updateFilters } = useCatalogFilters()
  const { data, isLoading, isError } = useCatalog(filters)
  const { data: genres } = useGenres()
  const { data: authors } = useAuthors()

  const handleReset = () => {
    updateFilters({
      search: '',
      genreId: undefined,
      authorId: undefined,
      collection: undefined,
      page: 1,
    })
  }

  if (isError)
    return (
      <div className={styles.errorContainer}>
        <EmptyState
          title="Ошибка загрузки"
          description="Не удалось получить список книг. Попробуйте позже."
          onAction={() => window.location.reload()}
          actionText="Обновить страницу"
        />
      </div>
    )

  return (
    <div className={styles.catalogWrapper}>
      <div className={styles.glowSpot} />

      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[
              { title: <Link to="/">Главная</Link> },
              { title: 'Каталог' },
            ]}
          />

          <div className={styles.titleRow}>
            <div className={styles.titleContent}>
              <Title className={styles.mainTitle}>
                {data?.collection?.title || 'Все книги'}
              </Title>
              <div className={styles.indicator}>
                <div className={styles.dot} />
                <Text className={styles.totalCount}>
                  {data?.pagination.total || 0} изданий
                </Text>
              </div>
            </div>
            {filters.collection && (
              <Button
                className={styles.resetButton}
                icon={<CloseOutlined />}
                onClick={() => updateFilters({ collection: undefined })}
              >
                Сбросить подборку
              </Button>
            )}
          </div>

          <Text className={styles.description}>
            {data?.collection?.description ||
              'Кураторский список литературы, собранный нашими экспертами специально для вас.'}
          </Text>
        </header>

        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
              <FilterOutlined /> <span>Фильтры</span>
            </div>
            <Select
              placeholder="Жанр"
              className={styles.premiumSelect}
              allowClear
              value={filters.genreId}
              onChange={val => updateFilters({ genreId: val })}
              options={genres?.map(g => ({ label: g.label, value: g.id }))}
            />
            <Select
              showSearch
              placeholder="Автор"
              className={styles.premiumSelect}
              allowClear
              value={filters.authorId}
              onChange={val => updateFilters({ authorId: val })}
              options={authors?.map(a => ({
                label: `${a.firstName} ${a.lastName}`,
                value: a.id,
              }))}
            />
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Сортировка</span>
            <Select
              variant="borderless"
              className={styles.sortSelect}
              suffixIcon={<SwapOutlined rotate={90} />}
              value={filters.sort}
              onChange={val => updateFilters({ sort: val as any })}
              options={[
                { value: 'newest', label: 'Новинки' },
                { value: 'oldest', label: 'Раритеты' },
                { value: 'title', label: 'По алфавиту' },
              ]}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <BookSkeleton key={i} />)
          ) : data?.items?.length ? (
            data.items.map(book => (
              <div key={book.id} className={styles.gridItem}>
                <BookCard book={book} />
              </div>
            ))
          ) : (
            <div className={styles.emptyWrapper}>
              <EmptyState
                onAction={handleReset}
                actionText="Вернуться в общий каталог"
              />
            </div>
          )}
        </div>

        {!isLoading && data?.pagination && (
          <div className={styles.paginationWrapper}>
            <Pagination
              current={filters.page}
              total={data.pagination.total}
              pageSize={filters.limit}
              onChange={page => updateFilters({ page })}
              showSizeChanger={false}
              hideOnSinglePage
            />
          </div>
        )}
      </div>
    </div>
  )
}
