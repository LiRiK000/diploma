import React from 'react'
import { Statistic, Row, Col } from 'antd'
import { UserOutlined, BookOutlined } from '@ant-design/icons'

export const LibrariansKpi: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic
          title="Активные читатели"
          value={1128}
          prefix={<UserOutlined />}
        />
      </Col>
      <Col span={12}>
        <Statistic title="Книг на руках" value={93} prefix={<BookOutlined />} />
      </Col>
    </Row>
  )
}
