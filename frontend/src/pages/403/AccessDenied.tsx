import { routes } from '@shared/constants'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

export const AccessDenied = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="403"
      subTitle="У вас нет доступа к этой странице."
      extra={
        <Button type="primary" onClick={() => navigate(routes.home)}>
          На главную
        </Button>
      }
    />
  )
}
