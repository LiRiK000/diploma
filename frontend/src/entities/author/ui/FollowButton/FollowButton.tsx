// FollowButton.tsx
import { useState } from 'react'
import { Button } from 'antd'
import {
  UserAddOutlined,
  UserDeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { pluralizeFollowers } from '@shared/utils/pluralize'
import styles from './FollowButton.module.scss'
import { useAuthorMutation } from '@features/follow-author/hooks/useFollowAuthor'

interface Props {
  authorId: string
  isFollowing: boolean
  followersCount: number
}

export const FollowButton = ({
  authorId,
  isFollowing,
  followersCount,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const mutation = useAuthorMutation(authorId)

  const handleAction = () => {
    mutation.mutate()
  }

  return (
    <div className={styles.wrapper}>
      <Button
        type={isFollowing ? 'default' : 'primary'}
        size="large"
        loading={mutation.isPending}
        onClick={handleAction}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        icon={
          isFollowing ? (
            isHovered ? (
              <UserDeleteOutlined />
            ) : (
              <CheckOutlined />
            )
          ) : (
            <UserAddOutlined />
          )
        }
        danger={isFollowing && isHovered}
        className={isFollowing ? styles.subscribed : ''}
      >
        {isFollowing ? 'Вы подписаны' : 'Подписаться'}
      </Button>

      <span className={styles.counter}>
        <b>{followersCount}</b> {pluralizeFollowers(followersCount)}
      </span>
    </div>
  )
}
