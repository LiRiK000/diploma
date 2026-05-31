import React, { useState } from 'react'
import { Carousel, Button } from 'antd'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SLIDES } from './HomeCarousel.constants'
import styles from './HomeCarousel.module.scss'

const handleNavigate = (slug: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = slug
  }
}

export const HomeCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const bounceX = useSpring(mouseX, springConfig)
  const bounceY = useSpring(mouseY, springConfig)

  const moveX = useTransform(bounceX, [-300, 300], [-15, 15])
  const moveY = useTransform(bounceY, [-300, 300], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const moveFactorX = clientX - window.innerWidth / 2
    const moveFactorY = clientY - window.innerHeight / 2
    mouseX.set(moveFactorX)
    mouseY.set(moveFactorY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: custom * 0.12,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  return (
    <div
      className={styles.carouselWrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        autoplay
        autoplaySpeed={5500}
        effect="fade"
        pauseOnHover={false}
        dots={{ className: styles.customDots }}
        beforeChange={(_, next) => setCurrentSlide(next)}
      >
        {SLIDES.map(
          ({ id, title, desc, buttonText, color, type, Icon, slug }, index) => {
            const isActive = currentSlide === index

            return (
              <div key={id}>
                <div className={`${styles.slide} ${styles[type]}`}>
                  <div className={styles.content}>
                    <AnimatePresence>
                      {isActive && (
                        <>
                          <motion.h3
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                          >
                            {title}
                          </motion.h3>

                          <motion.p
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                          >
                            {desc}
                          </motion.p>

                          <motion.div
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                            className={styles.btnContainer}
                          >
                            <Button
                              type="primary"
                              className={styles.appleBtn}
                              onClick={() => handleNavigate(slug)}
                              style={
                                {
                                  '--slide-color': color,
                                  '--shadow-color': `${color}40`,
                                } as React.CSSProperties
                              }
                            >
                              <span>{buttonText}</span>
                              <ArrowRight
                                className={styles.arrowIcon}
                                size={20}
                              />
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className={styles.floatingIconWrapper}>
                    <motion.div
                      style={{ x: moveX, y: moveY }}
                      animate={
                        isActive
                          ? {
                              y: [0, -12, 0],
                              rotate: [0, 3, -3, 0],
                              scale: 1,
                              opacity: 1,
                            }
                          : { scale: 0.9, opacity: 0 }
                      }
                      transition={
                        isActive
                          ? {
                              y: {
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              rotate: {
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                              default: { duration: 0.6 },
                            }
                          : { duration: 0.4 }
                      }
                    >
                      <Icon
                        className={styles.lucideIcon}
                        style={
                          { '--current-color': color } as React.CSSProperties
                        }
                      />
                    </motion.div>
                  </div>

                  <div
                    className={styles.imageOverlay}
                    style={{
                      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                    }}
                  />
                </div>
              </div>
            )
          },
        )}
      </Carousel>
    </div>
  )
}
