import { useNavigate } from 'react-router-dom'
import { useGetMe } from './hooks/useGetMe'
import { Loader } from '@shared/components/Loader'
import { routes } from '@shared/constants'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const { data, isLoading } = useGetMe()

  if (isLoading) return <Loader />

  if (data?.status !== 'success') {
    navigate(routes.login)
  }

  return <div>{children}</div>
}
