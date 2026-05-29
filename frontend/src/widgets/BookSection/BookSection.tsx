import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BookCard } from '@entities/book'
import styles from './BookSection.module.scss'

interface Book {
  id: string | number
  [key: string]: any
}

interface BookSectionProps {
  title: string
  books: Book[]
  linkTo: string
}

export const BookSection: React.FC<BookSectionProps> = ({
  title,
  books,
  linkTo,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  )

  const onSelect = useCallback((api: any) => {
    setPrevBtnEnabled(api.canScrollPrev())
    setNextBtnEnabled(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <Link to={linkTo} className={styles.viewAllBtn}>
          <span>Смотреть все</span>
          <ArrowUpRight className={styles.viewAllIcon} />
        </Link>
      </div>

      <div className={styles.viewportWrapper}>
        <button
          className={`${styles.navBtn} ${styles.prev}`}
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Назад"
        >
          <LeftOutlined />
        </button>

        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.container}>
            {books.map(book => (
              <div className={styles.slide} key={book.id}>
                <BookCard book={book} />
              </div>
            ))}

            <div className={styles.slide}>
              <Link to={linkTo} className={styles.catalogLink}>
                <div className={styles.catalogCard}>
                  <ArrowRightOutlined className={styles.catalogIcon} />
                  <span>Перейти в каталог</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <button
          className={`${styles.navBtn} ${styles.next}`}
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Вперед"
        >
          <RightOutlined />
        </button>
      </div>
    </section>
  )
}
