import React from 'react'
import { Carousel, Button } from 'antd'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SLIDES } from './HomeCarousel.constants'
import styles from './HomeCarousel.module.scss'

export const HomeCarousel: React.FC = () => {
  return (
    <div className={styles.carouselWrapper}>
      <Carousel
        autoplay
        autoplaySpeed={6000}
        effect="fade"
        pauseOnHover={false}
        easing="cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {SLIDES.map(({ id, title, desc, buttonText, color, type, Icon }) => (
          <div key={id}>
            <div
              className={`${styles.slide} ${styles[type]}`}
              style={{ color: color }}
            >
              <div className={styles.content}>
                <h3>{title}</h3>
                <p>{desc}</p>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRight size={20} />}
                  style={{
                    height: '64px',
                    padding: '0 40px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: 700,
                    background: color,
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: `0 20px 40px -10px ${color}66`,
                  }}
                >
                  {buttonText}
                </Button>
              </div>

              <div className={styles.floatingIconWrapper}>
                <motion.div
                  animate={{
                    y: [0, -25, 0],
                    rotate: [0, 8, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Icon
                    size={260}
                    strokeWidth={1}
                    style={{
                      opacity: 0.2,
                      filter: 'drop-shadow(0 0 40px currentColor)',
                    }}
                  />
                </motion.div>
              </div>

              <div
                className={styles.imageOverlay}
                style={{ background: color }}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
