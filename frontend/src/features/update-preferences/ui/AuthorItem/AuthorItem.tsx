import { Avatar, Typography } from 'antd'
import { HeartFilled } from '@ant-design/icons'
import styles from './ArtistItem.module.scss'

const { Text } = Typography

interface ArtistItemProps {
  name: string
  image: string
  isSelected: boolean
  onClick: () => void
}
export const ArtistItem = ({
  name,
  // image,
  isSelected,
  onClick,
}: ArtistItemProps) => {
  return (
    <div
      className={`${styles.wrapper} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.avatarContainer}>
        <Avatar
          size={{ xs: 80, sm: 110, md: 140, lg: 160, xl: 120 }}
          src={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbOzkvsEjCljaTxmCHGNwsMS_Ib_iulbLbDA&s'
          }
          className={styles.avatar}
        />
        <div className={styles.heartBadge}>
          <HeartFilled />
        </div>
      </div>
      <Text className={styles.name} ellipsis>
        {name}
      </Text>
    </div>
  )
}
