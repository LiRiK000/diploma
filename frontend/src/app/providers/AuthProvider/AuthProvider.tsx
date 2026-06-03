import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { notification } from 'antd'
import { useGetMe } from './hooks/useGetMe'
import { Loader } from '@shared/components/Loader'
import { routes } from '@shared/constants'
import { USER_ROLES } from '@entities/user'
import { AccessDenied } from '@pages/403'

export const AuthProvider = ({ children, strictTo }: AuthProviderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data, isLoading } = useGetMe()

  useEffect(() => {
    if (!isLoading && data?.status !== 'success') {
      notification.warning({
        message: 'Доступ ограничен',
        description: 'Пожалуйста, авторизуйтесь для продолжения.',
      })
      void navigate(routes.login, {
        state: { from: location.pathname },
        replace: true,
      })
    }
  }, [data, isLoading, navigate, location.pathname])

  if (isLoading) return <Loader />

  // Блокируем рендер, если пользователь не залогинен
  if (data?.status !== 'success') return null

  // Проверка прав (например, только для библиотекаря)
  if (strictTo && data?.data.user.role !== strictTo) {
    return <AccessDenied />
  }

  return <>{children}</>
}
