import React from 'react'

interface KpiItem {
  name: string
  value: number
}

interface LibrarianKpiProps {
  data: KpiItem[] | null
}

export const LibrarianKpi: React.FC<LibrarianKpiProps> = React.memo(
  ({ data }) => {
    const getValue = (name: string) => {
      if (!Array.isArray(data)) return 0
      return data.find(item => item.name === name)?.value || 0
    }

    const readers = getValue('Читатели')
    const orders = getValue('Заказы')
    const issuances = getValue('Выдачи')
    const reviews = getValue('Отзывы')

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
          padding: '0 8px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(22px, 2.5vw, 28px)',
              fontWeight: '800',
              color: '#1890ff',
              margin: 0,
            }}
          >
            {readers.toLocaleString()}
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: 0,
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            Читатели
          </p>
        </div>

        <div
          style={{
            borderLeft: '1px solid var(--glass-border)',
            height: '30px',
            opacity: 0.3,
          }}
        />

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(22px, 2.5vw, 28px)',
              fontWeight: '800',
              color: '#faad14',
              margin: 0,
            }}
          >
            {orders.toLocaleString()}
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: 0,
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            Заказы
          </p>
        </div>

        <div
          style={{
            borderLeft: '1px solid var(--glass-border)',
            height: '30px',
            opacity: 0.3,
          }}
        />

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(22px, 2.5vw, 28px)',
              fontWeight: '800',
              color: '#52c41a',
              margin: 0,
            }}
          >
            {issuances.toLocaleString()}
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: 0,
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            Выдачи
          </p>
        </div>

        <div
          style={{
            borderLeft: '1px solid var(--glass-border)',
            height: '30px',
            opacity: 0.3,
          }}
        />

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(22px, 2.5vw, 28px)',
              fontWeight: '800',
              color: '#722ed1',
              margin: 0,
            }}
          >
            {reviews.toLocaleString()}
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: 0,
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            Отзывы
          </p>
        </div>
      </div>
    )
  },
)

LibrarianKpi.displayName = 'LibrarianKpi'
