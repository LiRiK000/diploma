import styles from './AuthorHeroSection.module.scss'
import { ToShareButton } from '@features/to-share/components'
import { AuthorHeroSectionProps } from '../../types'
import { formatDate } from '@shared/utils/dataFormater'
import { FollowButton } from '../FollowButton/FollowButton'

export const AuthorHeroSection = ({ author }: AuthorHeroSectionProps) => {
  const dateOfBirth = formatDate(author.dateOfBirth)

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <img
          src="/book.png"
          alt={`${author.firstName} ${author.lastName}`}
          className={styles.cover}
        />

        <div className={styles.info}>
          <h1 className={styles.title}>
            {author.firstName} {author.lastName}
          </h1>

          <p className={styles.dates}>Дата рождения: {dateOfBirth}</p>

          <div className={styles.stats}>
            {/* сюда можно добавить книги / подписчиков */}
          </div>

          <div className={styles.actions}>
            <FollowButton
              authorId={author.id}
              isFollowing={author.isFollowing}
              followersCount={author.followersCount}
            />

            <div className={styles.secondaryActions}>
              <ToShareButton title={author.firstName} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
