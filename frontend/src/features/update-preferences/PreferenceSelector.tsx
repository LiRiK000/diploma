import { useState, useMemo } from 'react'
import { Button, Col, Input, Row } from 'antd'
import { Search } from 'lucide-react'
import { ArtistItem } from '@features/update-preferences/ui/AuthorItem'
import styles from './PreferenceSelector.module.scss'
import { usePreferenceAuthors } from './hooks/usePreferences'
import { Loader } from '@shared/components/Loader'

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
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Input
        size="large"
        placeholder="Поиск любимых авторов..."
        prefix={<Search size={18} className={styles.searchIcon} />}
        className={styles.searchInput}
        onChange={e => setSearch(e.target.value)}
        allowClear
      />

      <div className={styles.gridWrapper}>
        <Row gutter={[16, 24]} justify="start" className={styles.artistsRow}>
          {filteredArtists.map(artist => (
            <Col
              key={artist.id}
              xs={8}
              sm={6}
              md={6}
              lg={4}
              className={styles.artistCol}
            >
              <ArtistItem
                name={artist.fullName}
                image={artist.photoUrl || '/author.png'}
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
          block
          size="large"
          className={styles.submitBtn}
          loading={isSubmitting}
          disabled={selectedIds.length === 0}
          onClick={handleSubmit}
        >
          Подтвердить выбор{' '}
          {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
      </div>
    </div>
  )
}
