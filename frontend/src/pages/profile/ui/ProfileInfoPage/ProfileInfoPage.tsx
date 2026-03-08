import styles from './ProfileInfoPage.module.scss'
import {
  LinkOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'

export const ProfileInfoPage = () => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          <UserOutlined className={styles.avatarIcon} />
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
          {[
            {
              label: 'ФИО',
              value: 'Битаев Фёдор Михайлович',
              status: 'normal',
            },
            { label: 'Дата рождения', value: '3 Мая 2007', status: 'normal' },
            { label: 'Пол', value: 'Не указан', status: 'muted' },
            { label: 'Телефон', value: '+7 996 966 12 80', status: 'normal' },
            { label: 'Почта', value: 'Не указана', status: 'muted' },
          ].map((item, idx) => (
            <div className={styles.row} key={idx}>
              <span>{item.label}</span>
              <span
                className={
                  item.status === 'muted' ? styles.muted : styles.value
                }
              >
                {item.value}
              </span>
            </div>
          ))}

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
            <span className={styles.value}>Фёдор Б.</span>
          </div>

          <div className={styles.row}>
            <span>Локация</span>
            <span className={styles.muted}>Россия, Москва</span>
          </div>

          <div className={styles.row}>
            <span>Возраст</span>
            <span className={styles.value}>
              18 <span className={styles.muted}>(скрыт настройками)</span>
            </span>
          </div>

          <button className={styles.secondaryButton}>
            Изменить публичный профиль
          </button>
        </div>
      </section>
    </div>
  )
}
