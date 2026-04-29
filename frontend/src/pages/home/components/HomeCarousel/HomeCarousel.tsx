import React from 'react'
import { Carousel, Button } from 'antd'
import styles from './HomeCarousel.module.scss'

const SLIDES = [
  {
    id: 1,
    title: 'Мир фэнтези ждет вас',
    desc: 'Лучшие новинки этого месяца со скидкой до 20%',
    buttonText: 'Смотреть подборку',
    color: '#6366f1',
  },
  {
    id: 2,
    title: 'Классика в новом формате',
    desc: 'Слушайте любимые произведения в аудио',
    buttonText: 'Попробовать',
    color: '#ec4899',
  },
]

export const HomeCarousel: React.FC = () => {
  return (
    <div className={styles.carouselWrapper}>
      <Carousel
        autoplay
        autoplaySpeed={5000}
        effect="fade"
        pauseOnHover={false}
      >
        {SLIDES.map(slide => (
          <div key={slide.id}>
            <div className={styles.slide}>
              <div className={styles.content}>
                <h3>{slide.title}</h3>
                <p>{slide.desc}</p>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    borderRadius: '12px',
                    background: slide.color,
                    border: 'none',
                  }}
                >
                  {slide.buttonText}
                </Button>
              </div>

              <div
                className={styles.imageOverlay}
                style={{
                  background: `radial-gradient(circle at right, ${slide.color}22, transparent 70%)`,
                }}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
