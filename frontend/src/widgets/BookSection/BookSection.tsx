import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Typography, Button } from 'antd'
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { BookCard } from '@entities/book'
import styles from './BookSection.module.scss'

const { Title } = Typography

export const BookSection = ({
  title,
  books,
  linkTo,
}: {
  title: string
  books: any[]
  linkTo: string
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
        <Title level={2} className={styles.title}>
          {title}
        </Title>
        <Link to={linkTo}>
          <Button type="link" icon={<ArrowRightOutlined />}>
            Смотреть все
          </Button>
        </Link>
      </div>

      <div className={styles.viewportWrapper}>
        {prevBtnEnabled && (
          <button
            className={`${styles.navBtn} ${styles.prev}`}
            onClick={scrollPrev}
          >
            <LeftOutlined />
          </button>
        )}

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

        {nextBtnEnabled && (
          <button
            className={`${styles.navBtn} ${styles.next}`}
            onClick={scrollNext}
          >
            <RightOutlined />
          </button>
        )}
      </div>
    </section>
  )
}
