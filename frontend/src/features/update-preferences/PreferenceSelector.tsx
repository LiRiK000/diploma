import { useState, useMemo } from 'react'
import { Button, Col, Input, Row, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { ArtistItem } from '@features/update-preferences/ui/AuthorItem'
import styles from './PreferenceSelector.module.scss'
import { usePreferenceAuthors } from './hooks/usePreferences'

export const PreferenceSelector = () => {
  const { displayAuthors, popFromPool, isLoading, isSubmitting, submit } =
    usePreferenceAuthors(12)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const handleSelect = (id: string) => {
    const isAlreadySelected = selectedIds.includes(id)

    if (isAlreadySelected) {
      setSelectedIds(prev => prev.filter(item => item !== id))
    } else {
      setSelectedIds(prev => [...prev, id])
      popFromPool()
    }
  }

  const filteredArtists = useMemo(() => {
    return displayAuthors.filter(a =>
      a.fullName.toLowerCase().includes(search.toLowerCase()),
    )
  }, [displayAuthors, search])

  const handleSubmit = () => {
    submit(selectedIds)
  }

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Spin size="large" tip="Загрузка авторов..." />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Input
        size="large"
        placeholder="Поиск любимых авторов..."
        prefix={<SearchOutlined />}
        className={styles.searchInput}
        onChange={e => setSearch(e.target.value)}
        allowClear
      />

      <div className={styles.gridWrapper}>
        <Row gutter={[16, 40]} justify="start">
          {filteredArtists.map(artist => (
            <Col
              key={artist.id}
              xs={12}
              sm={8}
              md={6}
              lg={4}
              className={styles.artistCol}
            >
              <ArtistItem
                name={artist.fullName}
                image={`https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.id}`}
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
          loading={isSubmitting}
          disabled={selectedIds.length === 0}
          onClick={handleSubmit}
        >
          ПОДТВЕРДИТЬ ВЫБОР{' '}
          {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
      </div>
    </div>
  )
}
