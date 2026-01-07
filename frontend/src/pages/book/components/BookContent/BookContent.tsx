import { Card, Tag, Typography, Grid, Space, Divider, Button } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'
import styles from './BookContent.module.scss'
import { Activity } from 'react'
import { BookContentProps } from './types'

const { useBreakpoint } = Grid
const { Title, Paragraph, Text } = Typography
export const BookContent = ({
  description,
  subjects,
  details,
}: BookContentProps) => {
  const screens = useBreakpoint()
  const [showAllDetails, setShowAllDetails] = useState(false)
  const toggleDetails = () => {
    setShowAllDetails(prev => !prev)
  }
  const fullDetailsContent = (
    <div className={styles.details}>
      <Space
        direction={screens.xs ? 'vertical' : 'horizontal'}
        size="large"
        wrap
        className={styles.spaceContainer}
      >
        <Space direction="vertical" size="middle">
          <div>
            <Text strong>Издательство:</Text>{' '}
            <Text type="secondary">{details.publisher}</Text>
          </div>
          <div>
            <Text strong>Дата публикации:</Text>{' '}
            <Text type="secondary">{details.publishDate}</Text>
          </div>
          <div>
            <Text strong>Количество страниц:</Text>{' '}
            <Text type="secondary">{details.pages}</Text>
          </div>
        </Space>

        <Space direction="vertical" size="middle">
          <div>
            <Text strong>Язык:</Text>{' '}
            <Text type="secondary">{details.language}</Text>
          </div>
          <div>
            <Text strong>Формат:</Text>{' '}
            <Text type="secondary">{details.format}</Text>
          </div>

          <div>
            <Text strong>Размеры:</Text>{' '}
            <Text type="secondary">{details.dimensions}</Text>
          </div>
        </Space>
      </Space>
    </div>
  )
  const previewDetailsContent = (
    <div className={styles.previewDetails}>
      <Space size="large" wrap>
        <div>
          <Text strong>Издательство:</Text>
          <br />
          <Text type="secondary">{details.publisher}</Text>
        </div>
        <div>
          <Text strong>страниц:</Text>
          <br />
          <Text type="secondary">{details.pages}</Text>
        </div>
        <div>
          <Text strong>Язык:</Text>
          <br />
          <Text type="secondary">{details.language}</Text>
        </div>
      </Space>
    </div>
  )

  return (
    <Card
      className={styles.content}
      styles={{
        body: {
          padding: screens.xs ? '16px' : '24px',
        },
      }}
    >
      <Space
        direction="vertical"
        size="large"
        className={styles.spaceContainer}
      >
        <section>
          <Title level={2} className={styles.sectionTitle}>
            Описание
          </Title>
          <Paragraph className={styles.description}>{description}</Paragraph>
        </section>
        <Divider style={{ margin: '0.5rem 0' }} />
        <section>
          <Title level={3} className={styles.subSectionTitle}>
            тематика
          </Title>
          <div className={styles.subjects}>
            {subjects.map((subject, i) => (
              <Tag key={i} color="blue" className={styles.subjectTag}>
                {subject}
              </Tag>
            ))}
          </div>
        </section>
        <Divider style={{ margin: '0.5rem 0' }} />
        <section>
          <div className={styles.detailsHeader}>
            <Title level={3} className={styles.subSectionTitle}>
              Подробнее
            </Title>
            <Button
              type="link"
              onClick={toggleDetails}
              icon={showAllDetails ? <UpOutlined /> : <DownOutlined />}
              className={styles.toggleButton}
            >
              {showAllDetails ? 'Спрятать' : 'Подробнее'}
            </Button>
          </div>
          <Activity mode={showAllDetails ? 'visible' : 'hidden'}>
            {fullDetailsContent}
          </Activity>
          <Activity mode={showAllDetails ? 'hidden' : 'visible'}>
            {previewDetailsContent}
          </Activity>
        </section>
      </Space>
    </Card>
  )
}
