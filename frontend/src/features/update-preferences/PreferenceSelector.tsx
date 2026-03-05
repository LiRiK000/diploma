import { useState } from 'react'
import { Button, Col, Input, Row, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './PreferenceSelector.module.scss'
import { ArtistItem } from '@features/update-preferences/ui/AuthorItem'

const { Text } = Typography

// Те, кто отрисованы сразу
const MOCK_INITIAL = [
  { id: 1, name: 'PHARAOH' },
  { id: 2, name: 'Akon' },
  { id: 3, name: 'Баста' },
  { id: 4, name: 'LSP' },
  { id: 5, name: 'Boulevard Depo' },
  { id: 6, name: 'Yanix' },
]

// Наш "запас" для бесконечного добавления
const MOCK_POOL = [
  { id: 7, name: 'Thomas Mraz' },
  { id: 8, name: 'GONE.Fludd' },
  { id: 9, name: 'Mnogoznaal' },
  { id: 10, name: 'Saluki' },
  { id: 11, name: 'Rocket' },
  { id: 12, name: 'Big Baby Tape' },
  { id: 13, name: 'Kizaru' },
  { id: 14, name: 'Obladaet' },
]

export const PreferenceSelector = () => {
  const [artists, setArtists] = useState(MOCK_INITIAL)
  const [pool, setPool] = useState(MOCK_POOL)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')

  const handleSelect = (id: number) => {
    const isSelected = selectedIds.includes(id)

    if (isSelected) {
      setSelectedIds(prev => prev.filter(item => item !== id))
    } else {
      setSelectedIds(prev => [...prev, id])

      // ЛОГИКА РАНДОМНОГО ДОБАВЛЕНИЯ:
      if (pool.length > 0) {
        // Берем случайный индекс из пула
        const randomIndex = Math.floor(Math.random() * pool.length)
        const randomArtist = pool[randomIndex]

        // Добавляем в список и удаляем из пула
        setArtists(prev => [...prev, randomArtist])
        setPool(prev => prev.filter((_, index) => index !== randomIndex))
      }
    }
  }

  // Фильтрация для поиска
  const displayedArtists = artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className={styles.container}>
      <Input
        size="large"
        placeholder="Любимые исполнители"
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        className={styles.searchInput}
        onChange={e => setSearch(e.target.value)}
        variant="filled"
      />

      <div className={styles.gridWrapper}>
        {/* Увеличили вертикальный gutter до 40, чтобы было просторнее */}
        <Row gutter={[16, 40]} justify="start">
          {displayedArtists.map(artist => (
            <Col key={artist.id} xs={12} sm={8} md={6} lg={4}>
              <ArtistItem
                name={artist.name}
                image="http://192.168.1.138:9090/covers/books/1ba38a35-ae4f-49e1-98b0-35208d4a822c.webp"
                isSelected={selectedIds.includes(artist.id)}
                onClick={() => handleSelect(artist.id)}
              />
            </Col>
          ))}
        </Row>
      </div>

      <div className={styles.footer}>
        <Button
          type="primary"
          danger
          block
          size="large"
          className={styles.submitBtn}
          disabled={selectedIds.length === 0}
        >
          ПОДТВЕРДИТЬ {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
      </div>
    </div>
  )
}
