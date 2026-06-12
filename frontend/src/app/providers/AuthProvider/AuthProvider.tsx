import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { notification } from 'antd'
import { useGetMe } from './hooks/useGetMe'
import { Loader } from '@shared/components/Loader'
import { routes } from '@shared/constants'
import { USER_ROLES } from '@entities/user'
import { AccessDenied } from '@pages/403'
import type { UserRole } from '@shared/services/Auth/types'

interface AuthProviderProps {
  children: React.ReactNode
  strictTo?: UserRole
}

export const AuthProvider = ({ children, strictTo }: AuthProviderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data, isLoading, isError } = useGetMe()

  const isAuthenticated = data?.status === 'success'

  useEffect(() => {
    if (!isLoading && (isError || !isAuthenticated)) {
      notification.warning({
        message: 'Доступ ограничен',
        description: 'Пожалуйста, авторизуйтесь для продолжения.',
      })
      void navigate(routes.login, {
        state: { from: location.pathname },
        replace: true,
      })
    }
  }, [data, isLoading, isError, isAuthenticated, navigate, location.pathname])

  if (isLoading) return <Loader />

  if (isError || !isAuthenticated) return null

  if (strictTo && data.data.role !== strictTo) {
    return <AccessDenied />
  }

  return <>{children}</>
}
