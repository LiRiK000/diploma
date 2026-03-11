import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'
import styles from './ProfileInfoPage.module.scss'
import {
  LinkOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
export const ProfileInfoPage = () => {
  const { data, isLoading } = useGetMe()

  const user = data?.data.user

  if (isLoading) return <div>Загрузка профиля...</div>

  return (
    <div className={styles.wrapper}>
      <header className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" />
          ) : (
            <UserOutlined className={styles.avatarIcon} />
          )}
        </div>
        <button className={styles.avatarButton}>Изменить фото</button>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <SafetyCertificateOutlined />
            Учётные данные
          </h2>
          <p>
            Личные данные для подтверждения личности и безопасности вашего
            аккаунта.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>ФИО</span>
            <span className={styles.value}>
              {user?.name} {user?.surname}
            </span>
          </div>

          <div className={styles.row}>
            <span>Телефон</span>
            <span className={user?.phone ? styles.value : styles.muted}>
              {user?.phone ?? 'Не указан'}
            </span>
          </div>

          <div className={styles.row}>
            <span>Пол</span>
            <span className={user?.gender ? styles.value : styles.muted}>
              {user?.gender === 'MALE'
                ? 'Мужской'
                : user?.gender === 'FEMALE'
                  ? 'Женский'
                  : 'Не указан'}
            </span>
          </div>

          <div className={styles.row}>
            <span>Телефон</span>
            <span className={user?.phone ? styles.value : styles.muted}>
              {user?.phone ? `+${user.phone}` : 'Не указан'}
            </span>
          </div>

          <div className={styles.row}>
            <span>Почта</span>
            <span className={styles.value}>{user?.email}</span>
          </div>

          <button className={styles.primaryButton}>Редактировать данные</button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <LinkOutlined />
            Публичные данные
          </h2>
          <p>
            Эта информация видна другим читателям библиотеки рядом с вашими
            рецензиями.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>Отображаемое имя</span>
            <span className={styles.value}>
              {user?.displayName || `${user?.name} ${user?.surname?.[0]}.`}
            </span>
          </div>

          <div className={styles.row}>
            <span>Локация</span>
            <span className={styles.muted}>Россия, Москва</span>{' '}
          </div>

          <div className={styles.row}>
            <span>Роль</span>
            <span className={styles.value}>{user?.role}</span>
          </div>

          <button className={styles.secondaryButton}>
            Изменить публичный профиль
          </button>
        </div>
      </section>
    </div>
  )
}
