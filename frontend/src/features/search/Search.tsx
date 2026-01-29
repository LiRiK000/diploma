import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Input, List, Typography, Spin, Empty, Button } from 'antd'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Search.module.scss'
import { useDebounce } from './hooks/useDebounce'
import { useBookSuggestions } from './hooks/useBookSuggestions'

const { Search: AntdSearch } = Input
const { Text } = Typography

interface IBookSuggestion {
  id: string
  title: string
  author: string | null
  type: 'book' | 'author'
}

export const Search = () => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()

  // Для предотвращения мерцания при клике
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSearch = useDebounce(value, 350)
  const { data: suggestions = [], isLoading } =
    useBookSuggestions(debouncedSearch)

  const handleSearch = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    // Просто переходим на страницу поиска.
    // Наша SearchPage сама поймет: показать "Ничего не найдено", рекомендации или результат.
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)

    // Закрываем дропдаун и убираем фокус
    setIsFocused(false)
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
  }

  const navigateToItem = (item: IBookSuggestion) => {
    const path =
      item.type === 'author' ? `/author/${item.id}` : `/book/${item.id}`
    navigate(path)
    setValue('') // Очищаем поиск после перехода
    setIsFocused(false)
  }

  const showDropdown = isFocused && value.trim().length >= 2

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchContainer}>
        <AntdSearch
          placeholder="Найти книгу или автора..."
          enterButton={
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleSearch(value)}
            />
          }
          size="large"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => {
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
            setIsFocused(true)
          }}
          // Используем таймаут, чтобы клик по списку успел сработать до закрытия
          onBlur={() => {
            blurTimeoutRef.current = setTimeout(() => setIsFocused(false), 200)
          }}
          onSearch={handleSearch}
          className={styles.searchInput}
          allowClear
        />

        {showDropdown && (
          <div className={styles.dropdownList}>
            {isLoading ? (
              <div className={styles.infoState}>
                <Spin size="small" />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  Ищем...
                </Text>
              </div>
            ) : suggestions.length > 0 ? (
              <List
                dataSource={suggestions}
                renderItem={(item: IBookSuggestion) => (
                  <List.Item
                    className={styles.listItem}
                    // onMouseDown срабатывает ДО onBlur инпута, это важно!
                    onMouseDown={e => {
                      e.preventDefault() // Чтобы не сработал Blur на инпуте раньше времени
                      navigateToItem(item)
                    }}
                  >
                    <div className={styles.suggestionItem}>
                      <div className={styles.iconWrapper}>
                        {item.type === 'author' ? (
                          <UserOutlined />
                        ) : (
                          <SearchOutlined />
                        )}
                      </div>
                      <div className={styles.suggestionText}>
                        <Text strong={item.type === 'author'}>
                          {item.title}
                        </Text>
                        {item.author && (
                          <Text type="secondary" className={styles.authorName}>
                            <UserOutlined style={{ fontSize: 12 }} />{' '}
                            {item.author}
                          </Text>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div className={styles.infoState}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Ничего не найдено"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
