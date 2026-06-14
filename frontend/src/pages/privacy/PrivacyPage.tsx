import React from 'react'

export const CookiePage = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.icon}>🍪</div>
        <h1 style={styles.title}>Политика использования файлов Cookie</h1>
        <p style={styles.subtitle}>
          Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
        </p>
      </header>

      <main style={styles.content}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Что такое файлы cookie?</h2>
          <p style={styles.text}>
            Cookie — это небольшие текстовые файлы, которые сохраняются на вашем
            устройстве (компьютере, планшете или смартфоне) при посещении
            веб-сайтов. Они помогают сайту запоминать информацию о вас,
            например, на каком языке вы просматриваете страницы, чтобы в
            следующий раз вам было удобнее.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Как мы используем cookie?</h2>
          <p style={styles.text}>Мы используем куки для следующих целей:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <strong>Обязательные:</strong> Нужны для базовой работы сайта
              (авторизация, корзина).
            </li>
            <li style={styles.listItem}>
              <strong>Аналитические:</strong> Помогают нам понять, как
              пользователи взаимодействуют с сайтом (например, Google
              Analytics).
            </li>
            <li style={styles.listItem}>
              <strong>Функциональные:</strong> Запоминают ваши настройки (темная
              тема, регион).
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Как управлять cookie?</h2>
          <p style={styles.text}>
            Вы можете заблокировать или удалить файлы cookie через настройки
            своего браузера. Однако учтите, что отключение некоторых куки может
            привести к тому, что часть функций сайта перестанет работать
            корректно.
          </p>
        </section>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Если у вас остались вопросы, свяжитесь с нами по адресу:{' '}
          <a href="mailto:support@example.com" style={styles.link}>
            support@example.com
          </a>
        </p>
      </footer>
    </div>
  )
}

// Простые и стильные инлайн-стили
const styles = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: '740px',
    margin: '0 auto',
    padding: '40px 20px',
    color: '#333',
    lineHeight: '1.6',
  },
  header: {
    textAlign: 'center' as const,
    borderBottom: '1px solid #eaeaea',
    paddingBottom: '30px',
    marginBottom: '30px',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '32px',
    color: '#111',
    margin: '0 0 10px 0',
    fontWeight: '700',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
  content: {
    marginBottom: '40px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#22px',
    marginBottom: '12px',
    fontWeight: '600',
  },
  text: {
    fontSize: '16px',
    color: '#444',
    margin: '0 0 16px 0',
  },
  list: {
    paddingLeft: '20px',
    margin: '0 0 16px 0',
  },
  listItem: {
    fontSize: '16px',
    color: '#444',
    marginBottom: '8px',
  },
  footer: {
    borderTop: '1px solid #eaeaea',
    paddingTop: '20px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
  },
}
