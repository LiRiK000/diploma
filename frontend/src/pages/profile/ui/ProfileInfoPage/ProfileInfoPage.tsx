import styles from './ProfileInfoPage.module.scss'
import {
  LinkOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'

export const ProfileInfoPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          <UserOutlined className={styles.avatarIcon} />
        </div>
        <button className={styles.avatarButton}>Изменить аватар</button>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span></span>
          <h2>
            <SafetyCertificateOutlined />
            Учётные данные
          </h2>
          <p>
            Вы можете менять свои личные данные, подтверждать почту и управлять
            безопасностью аккаунта.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>ФИО</span>
            <span className={styles.value}>Петухов Фёдор</span>
          </div>

          <div className={styles.row}>
            <span>Дата рождения</span>
            <span className={styles.value}>3 Мая 2007</span>
          </div>

          <div className={styles.row}>
            <span>Пол</span>
            <span className={styles.muted}>Не указан</span>
          </div>

          <div className={styles.row}>
            <span>Телефон</span>
            <span className={styles.value}>+7 996 966 12 80</span>
          </div>

          <div className={styles.row}>
            <span>Почта</span>
            <span className={styles.muted}>Не указана</span>
          </div>

          <button className={styles.primaryButton}>
            Изменить учётные данные
          </button>
        </div>
      </section>

      {/* ===== ПУБЛИЧНЫЕ ДАННЫЕ ===== */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            {' '}
            <LinkOutlined />
            Публичные данные
          </h2>
          <p>
            Эта информация отображается рядом с отзывами и видна другим
            пользователям.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>Имя</span>
            <span className={styles.value}>Фёдор П.</span>
          </div>

          <div className={styles.row}>
            <span>Страна, город</span>
            <span className={styles.muted}>Не указано</span>
          </div>

          <div className={styles.row}>
            <span>Возраст</span>
            <span className={styles.value}>
              18 <span className={styles.muted}>(скрыт)</span>
            </span>
          </div>

          <button className={styles.secondaryButton}>
            Изменить публичные данные
          </button>
        </div>
      </section>
    </div>
  )
}
