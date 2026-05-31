import { Card, Tag, Typography, Button } from 'antd'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import styles from './BookContent.module.scss'
import { BookContentProps } from './types'

const { Title, Paragraph, Text } = Typography

export const BookContent = ({
  description,
  subjects,
  details,
}: BookContentProps) => {
  const [showAllDetails, setShowAllDetails] = useState(false)

  const toggleDetails = () => {
    setShowAllDetails(prev => !prev)
  }

  const allDetailItems = [
    { label: 'Издательство', value: details.publisher },
    { label: 'Дата публикации', value: details.publishDate },
    { label: 'Количество страниц', value: details.pages },
    { label: 'Язык', value: details.language },
    { label: 'Формат', value: details.format },
    { label: 'Размеры', value: details.dimensions },
  ].filter(item => item.value)

  const visibleDetailItems = showAllDetails
    ? allDetailItems
    : allDetailItems.slice(0, 3)

  return (
    <Card className={styles.content}>
      <div className={styles.innerWrapper}>
        <section className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Описание
          </Title>
          <Paragraph className={styles.description}>{description}</Paragraph>
        </section>

        {subjects && subjects.length > 0 && (
          <section className={styles.section}>
            <Title level={3} className={styles.subSectionTitle}>
              Тематика
            </Title>
            <div className={styles.subjects}>
              {subjects.map((subject, i) => (
                <Tag key={i} className={styles.subjectTag}>
                  {subject}
                </Tag>
              ))}
            </div>
          </section>
        )}

        {allDetailItems.length > 0 && (
          <section className={styles.section}>
            <div className={styles.detailsHeader}>
              <Title level={3} className={styles.subSectionTitle}>
                Характеристики
              </Title>
              {allDetailItems.length > 3 && (
                <Button
                  type="link"
                  onClick={toggleDetails}
                  icon={
                    showAllDetails ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )
                  }
                  className={styles.toggleButton}
                >
                  {showAllDetails ? 'Свернуть' : 'Развернуть'}
                </Button>
              )}
            </div>

            <div className={styles.detailsGrid}>
              {visibleDetailItems.map((item, index) => (
                <div key={index} className={styles.detailRow}>
                  <Text className={styles.detailLabel}>{item.label}</Text>
                  <div className={styles.detailLine} />
                  <Text className={styles.detailValue}>{item.value}</Text>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Card>
  )
}
