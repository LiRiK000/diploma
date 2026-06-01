import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    watchSlides: false,
  })

  const prevStateRef = useRef(false)
  const nextStateRef = useRef(false)

  const [buttons, setButtons] = useState({
    prev: false,
    next: false,
  })

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const updateButtons = useCallback(() => {
    if (!emblaApi) return

    const prev = emblaApi.canScrollPrev()
    const next = emblaApi.canScrollNext()

    if (prev !== prevStateRef.current || next !== nextStateRef.current) {
      prevStateRef.current = prev
      nextStateRef.current = next

      setButtons({ prev, next })
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateButtons()

    emblaApi.on('select', updateButtons)
    emblaApi.on('reInit', updateButtons)

    return () => {
      emblaApi.off('select', updateButtons)
      emblaApi.off('reInit', updateButtons)
    }
  }, [emblaApi, updateButtons])

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
          type="button"
          className={`${styles.navBtn} ${styles.prev}`}
          onClick={scrollPrev}
          disabled={!buttons.prev}
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
          type="button"
          className={`${styles.navBtn} ${styles.next}`}
          onClick={scrollNext}
          disabled={!buttons.next}
          aria-label="Вперёд"
        >
          <RightOutlined />
        </button>
      </div>
    </section>
  )
}
