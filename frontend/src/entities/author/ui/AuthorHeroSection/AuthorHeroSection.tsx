import styles from './AuthorHeroSection.module.scss'
import { ToShareButton } from '@features/to-share/components'
import { AuthorHeroSectionProps } from '../../types'
import { formatDate } from '@shared/utils/dataFormater'
import { Typography } from 'antd'
import { FollowButton } from '../FollowButton/FollowButton'

const { Text } = Typography

export const AuthorHeroSection = ({ author }: AuthorHeroSectionProps) => {
  const dateOfBirth = author.dateOfBirth
    ? formatDate(author.dateOfBirth)
    : 'Неизвестно'

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img
          src={author.avatar || '/author-placeholder.png'}
          className={styles.cover}
          alt={author.fullName}
        />

        <div className={styles.info}>
          <div className={styles.headerBlock}>
            <h1 className={styles.title}>{author.fullName}</h1>
            <Text className={styles.dates}>
              Родился: {dateOfBirth}
              {author.dateOfDeath &&
                ` — Умер: ${formatDate(author.dateOfDeath)}`}
            </Text>
          </div>

          <div className={styles.actions}>
            <FollowButton
              authorId={author.id}
              isFollowing={author.isFollowing}
              followersCount={author.followersCount}
            />

            <div className={styles.secondaryActions}>
              <ToShareButton title={author.fullName} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
