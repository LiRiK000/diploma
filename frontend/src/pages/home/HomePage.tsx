import { Typography } from 'antd'
import { BookFeed } from '@widgets/BookFeed'
import styles from './HomePage.module.scss'
import { HomeCarousel } from './components/HomeCarousel/HomeCarousel'

const { Title, Text } = Typography

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <HomeCarousel />

      <section className={styles.feedSection}>
        <div className={styles.sectionHeader}>
          <Title className={styles.sectionTitle}>Топ популярных</Title>
          <Text type="secondary" className={styles.sectionDesc}>
            Выбор наших читателей и самые обсуждаемые новинки недели
          </Text>
        </div>

        <BookFeed />
      </section>
    </div>
  )
}
