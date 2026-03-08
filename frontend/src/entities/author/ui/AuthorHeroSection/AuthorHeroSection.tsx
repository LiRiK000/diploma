import styles from './AuthorHeroSection.module.scss'
import { ToShareButton } from '@features/to-share/components'
import { AuthorHeroSectionProps } from '../../types'
import { formatDate } from '@shared/utils/dataFormater'
import { FollowButton } from '../FollowButton/FollowButton'
import { Typography } from 'antd'

const { Title, Text } = Typography

export const AuthorHeroSection = ({ author }: AuthorHeroSectionProps) => {
  const dateOfBirth = formatDate(author.dateOfBirth)

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img src={author.avatar || '/book.png'} className={styles.cover} />

        <div className={styles.info}>
          <div className={styles.headerBlock}>
            <h1 className={styles.title}>
              {author.firstName} {author.lastName}
            </h1>
            <Text className={styles.dates}>Родился: {dateOfBirth}</Text>
          </div>

          <div className={styles.actions}>
            <FollowButton
              authorId={author.id}
              isFollowing={author.isFollowing}
              followersCount={author.followersCount}
            />

            <div className={styles.secondaryActions}>
              <ToShareButton title={`${author.firstName} ${author.lastName}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
