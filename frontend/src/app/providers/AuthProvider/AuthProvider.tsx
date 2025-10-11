import { useNavigate } from 'react-router-dom'
import { useGetMe } from './hooks/useGetMe'
import { routes } from '../../constants'
import { Spin } from 'antd'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const { data, isLoading } = useGetMe()

  if (isLoading) return <Spin fullscreen />

  if (data?.status !== 'success') {
    navigate(routes.login)
  }

  return <div>{children}</div>
}
