import { Carousel, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useRef } from 'react'
import type { CarouselRef } from 'antd/es/carousel'

import { BookCard } from '@entities/book/ui/BookCard/BookCard'
import { chunkArray } from '@entities/author/utils/chunkArray'
import styles from './BooksCarousel.module.scss'
import { useAuthor } from '@entities/author/hooks/useAuthor'
import { BookCardView } from '@entities/book/ui/BookCard/types'

const SLIDES_PER_PAGE = 3

interface BooksCarouselProps {
  title?: string
}

export const BooksCarousel = ({ title }: BooksCarouselProps) => {
  const { author } = useAuthor()
  const book: BookCardView[] = author.topBook
  console.log(book, 'the bookl')

  const carouselRef = useRef<CarouselRef | null>(null)
  const slides = chunkArray(book, SLIDES_PER_PAGE)

  return (
    <section className={styles.wrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.carouselWrapper}>
        <Carousel ref={carouselRef} dots={false}>
          {slides.map((group, index) => (
            <div key={index}>
              <div className={styles.grid}>
                {group.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          ))}
        </Carousel>

        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => carouselRef.current?.prev()}
          className={styles.arrowLeft}
        />

        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={() => carouselRef.current?.next()}
          className={styles.arrowRight}
        />
      </div>
    </section>
  )
}
