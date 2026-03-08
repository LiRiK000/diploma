import { Select, Pagination, Space, Typography } from 'antd'
import { useCatalog } from '@entities/book/hooks/useCatalog'
import { useAuthors } from './hooks/useAuthors'
import { BookCard } from '@entities/book'
import { useGenres } from './hooks/useGenres'
import styles from './CatalogWidget.module.scss'
import { useCatalogFilters } from './hooks/useCatalogFilters'
import { EmptyState } from '@shared/components/Empty/EmptyState'
import { BookSkeleton } from './components/BookSkeleton/BookSkeleton'
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
      page: 1,
    })
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Ошибка загрузки"
          description="Не удалось получить список книг. Попробуйте позже."
          onAction={() => window.location.reload()}
          actionText="Обновить страницу"
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <Title>Каталог</Title>
        <Text type="secondary" style={{ fontSize: 18 }}>
          Исследуйте лучшие книги со всего мира
        </Text>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <Select
            placeholder="Все жанры"
            className={styles.select}
            allowClear
            value={filters.genreId}
            onChange={val => updateFilters({ genreId: val, page: 1 })}
            options={genres?.map(g => ({ label: g.label, value: g.id }))}
            style={{ width: 180 }}
          />

          <Select
            showSearch
            placeholder="Все авторы"
            className={styles.select}
            allowClear
            value={filters.authorId}
            onChange={val => updateFilters({ authorId: val, page: 1 })}
            options={authors?.map(a => ({
              label: `${a.firstName} ${a.lastName}`,
              value: a.id,
            }))}
            style={{ width: 200 }}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        <Space size={16}>
          <Text type="secondary">Сортировка:</Text>
          <Select
            variant="borderless"
            style={{ width: 140 }}
            value={filters.sort}
            onChange={val => updateFilters({ sort: val })}
            options={[
              { value: 'newest', label: 'По новизне' },
              { value: 'oldest', label: 'Старые' },
              { value: 'title', label: 'А—Я' },
            ]}
          />
        </Space>
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <BookSkeleton key={i} />)
        ) : data?.items && data.items.length > 0 ? (
          data.items.map(book => <BookCard key={book.id} book={book} />)
        ) : (
          <div className={styles.emptyWrapper}>
            <EmptyState
              onAction={handleReset}
              actionText="Показать все книги"
            />
          </div>
        )}
      </div>

      {!isLoading && (data?.items?.length ?? 0) > 0 && data?.pagination && (
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
  )
}
