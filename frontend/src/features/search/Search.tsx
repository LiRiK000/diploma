import { AudioOutlined } from '@ant-design/icons'
import { Input, List } from 'antd'
import { useState, useRef } from 'react'
import styles from './Search.module.scss'

const { Search: AntdSearch } = Input

const MOCK_HISTORY = ['Гарри Поттер', 'Война и мир', 'Преступление и наказание']
const MOCK_SUGGESTIONS = [
  'Гарри Поттер и философский камень',
  'Гарри Поттер и тайная комната',
  'Война и мир',
  'Преступление и наказание',
]

export const Search = () => {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (val: string) => {
    console.log('Search triggered:', val)
  }

  const filteredSuggestions = MOCK_SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(value.toLowerCase()),
  )

  const showHistory = focused && value.trim() === ''
  const showSuggestions = focused && value.trim() !== ''

  return (
    <div className={styles.searchContainer}>
      <div
        style={{
          position: 'relative',
          width: '800px',
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        <AntdSearch
          placeholder="Хочу найти"
          enterButton="Поиск"
          size="large"
          suffix={<AudioOutlined style={{ fontSize: 16, color: '#1677ff' }} />}
          onSearch={handleSearch}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          className={styles.searchInput}
          ref={inputRef}
        />

        {showHistory && (
          <List
            bordered
            size="small"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              zIndex: 2,
              background: '#fff',
              maxHeight: 200,
              overflowY: 'auto',
            }}
            dataSource={MOCK_HISTORY}
            renderItem={item => (
              <List.Item
                onMouseDown={() => handleSearch(item)}
                style={{ cursor: 'pointer' }}
              >
                {item}
              </List.Item>
            )}
          />
        )}

        {showSuggestions && (
          <List
            bordered
            size="small"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              zIndex: 1,
              background: '#fff',
              maxHeight: 200,
              overflowY: 'auto',
            }}
            dataSource={filteredSuggestions}
            renderItem={item => (
              <List.Item
                onMouseDown={() => handleSearch(item)}
                style={{ cursor: 'pointer' }}
              >
                {item}
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  )
}
