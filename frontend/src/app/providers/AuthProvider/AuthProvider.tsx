import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { notification } from 'antd'
import { useGetMe } from './hooks/useGetMe'
import { Loader } from '@shared/components/Loader'
import { routes } from '@shared/constants'
import { USER_ROLES } from '@entities/user'
import { AccessDenied } from '@pages/403'

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

interface AuthProviderProps {
  children: React.ReactNode
  strictTo?: UserRole
}
export const AuthProvider = ({ children, strictTo }: AuthProviderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data, isLoading } = useGetMe()

  useEffect(() => {
    if (!isLoading && data?.status !== 'success') {
      notification.warning({
        message: 'Доступ ограничен',
        description:
          'Пожалуйста, авторизуйтесь, чтобы просматривать эту страницу.',
      })
      void navigate(routes.login, {
        state: { from: location.pathname },
        replace: true,
      })
    }
  }, [data, isLoading, navigate, location.pathname])

  if (isLoading) return <Loader />

  if (data?.status !== 'success') {
    return null
  }

  if (strictTo && data?.data.role !== strictTo) {
    return <AccessDenied />
  }

  return <>{children}</>
}
