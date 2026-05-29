import { Input, List, Typography, Spin } from 'antd'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import styles from './Search.module.scss'
import { useDebounce } from './hooks/useDebounce'
import { useBookSuggestions } from './hooks/useBookSuggestions'
import { EmptyState } from '@shared/components/Empty/EmptyState'

const { Search: AntdSearch } = Input
const { Text } = Typography

interface SuggestionItem {
  id: string
  type: 'author' | 'book'
  title: string
  author?: string
  image?: string
}

export const Search = () => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const navigate = useNavigate()

  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<any>(null)

  const debouncedSearch = useDebounce(value, 350)
  const { data: suggestions = [] as SuggestionItem[], isLoading } =
    useBookSuggestions(debouncedSearch) as {
      data: SuggestionItem[]
      isLoading: boolean
    }

  useEffect(() => {
    setActiveIndex(-1)
  }, [suggestions])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFocused(false)
        if (inputRef.current) inputRef.current.blur()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleClear = () => {
    setValue('')
    setIsFocused(false)
    setActiveIndex(-1)
  }

  const handleSearch = (query: string) => {
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      navigateToItem(suggestions[activeIndex])
      return
    }

    const trimmed = query.trim()
    if (!trimmed) return
    void navigate(`/search?q=${encodeURIComponent(trimmed)}`)

    if (inputRef.current) inputRef.current.blur()

    setIsFocused(false)
    setValue('')
  }

  const navigateToItem = (item: { type: string; id: string }) => {
    const path =
      item.type === 'author' ? `/author/${item.id}` : `/book/${item.id}`
    void navigate(path)

    if (inputRef.current) inputRef.current.blur()

    setValue('')
    setIsFocused(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
    }
  }

  const showDropdown = isFocused && value.trim().length >= 2

  return (
    <>
      {isFocused &&
        createPortal(
          <div
            className={`${styles.overlay} ${styles.overlayVisible}`}
            onClick={() => {
              setIsFocused(false)
              if (inputRef.current) inputRef.current.blur()
            }}
          />,
          document.body,
        )}

      <div
        className={`${styles.searchWrapper} ${isFocused ? styles.active : ''}`}
      >
        <div className={styles.searchContainer}>
          <AntdSearch
            ref={inputRef}
            placeholder="Поиск книг или авторов..."
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
            onKeyDown={handleKeyDown}
            onSearch={handleSearch}
            className={styles.searchInput}
            allowClear
          />

          {showDropdown && (
            <div className={styles.dropdownList}>
              {isLoading ? (
                <div className={styles.infoState}>
                  <Spin tip="Ищем..." />
                </div>
              ) : suggestions.length > 0 ? (
                <List
                  dataSource={suggestions}
                  renderItem={(item: SuggestionItem, index: number) => {
                    const isActive = index === activeIndex
                    return (
                      <List.Item
                        className={`${styles.listItem} ${isActive ? styles.activeListItem : ''}`}
                        onMouseDown={e => {
                          e.preventDefault()
                          navigateToItem(item)
                        }}
                      >
                        <div className={styles.suggestionItem}>
                          <div className={styles.imageWrapper}>
                            <img
                              src={
                                item.image ||
                                (item.type === 'author'
                                  ? '/author.png'
                                  : '/book.png')
                              }
                              alt={item.title}
                              className={`${styles.suggestionImage} ${
                                item.type === 'author'
                                  ? styles.authorImg
                                  : styles.bookImg
                              }`}
                              onError={e => {
                                const target = e.target as HTMLImageElement
                                target.src =
                                  item.type === 'author'
                                    ? '/author.png'
                                    : '/book.png'
                              }}
                            />
                          </div>

                          <div className={styles.suggestionText}>
                            <Text strong className={styles.itemTitle}>
                              {item.title}
                            </Text>
                            {item.author && (
                              <Text
                                className={styles.authorName}
                                type="secondary"
                              >
                                {item.author}
                              </Text>
                            )}
                          </div>
                        </div>
                      </List.Item>
                    )
                  }}
                />
              ) : (
                <div className={styles.infoState}>
                  <EmptyState onAction={handleClear} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
