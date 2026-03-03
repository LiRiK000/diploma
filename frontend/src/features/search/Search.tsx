import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Input, List, Typography, Spin, Empty, Button } from 'antd'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import styles from './Search.module.scss'
import { useDebounce } from './hooks/useDebounce'
import { useBookSuggestions } from './hooks/useBookSuggestions'

const { Search: AntdSearch } = Input
const { Text } = Typography

export const Search = () => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSearch = useDebounce(value, 350)
  const { data: suggestions = [], isLoading } =
    useBookSuggestions(debouncedSearch)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFocused(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    if (isFocused && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFocused])

  const handleSearch = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    setIsFocused(false)
  }

  const navigateToItem = (item: any) => {
    const path =
      item.type === 'author' ? `/author/${item.id}` : `/book/${item.id}`
    navigate(path)
    setValue('')
    setIsFocused(false)
  }

  const showDropdown = isFocused && value.trim().length >= 2

  const overlay = isFocused ? (
    <div
      className={`${styles.overlay} ${styles.overlayVisible}`}
      onClick={() => setIsFocused(false)}
    />
  ) : null

  return (
    <>
      {isFocused &&
        createPortal(
          <div
            className={`${styles.overlay} ${styles.overlayVisible}`}
            onClick={() => setIsFocused(false)}
          />,
          document.body,
        )}

      <div
        className={`${styles.searchWrapper} ${isFocused ? styles.active : ''}`}
      >
        <div className={styles.searchContainer}>
          <AntdSearch
            placeholder="Поиск"
            size="large"
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              blurTimeoutRef.current = setTimeout(
                () => setIsFocused(false),
                200,
              )
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
                </div>
              ) : suggestions.length > 0 ? (
                <List
                  dataSource={suggestions}
                  renderItem={(item: any) => (
                    <List.Item
                      className={styles.listItem}
                      onMouseDown={e => {
                        e.preventDefault()
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
                          <Text strong={false}>{item.title}</Text>
                          {item.author && (
                            <Text className={styles.authorName}>
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
                    description="Нет результатов"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
