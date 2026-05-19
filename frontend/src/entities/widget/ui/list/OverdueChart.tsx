import React from 'react'
import { Empty } from 'antd'

export const OverdueChart: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Empty description="Здесь будет график просроченных книг (Recharts/AntD Charts)" />
    </div>
  )
}
