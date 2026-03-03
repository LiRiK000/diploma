import { useNavigate } from 'react-router-dom'
import { useGetMe } from './hooks/useGetMe'
import { Loader } from '@shared/components/Loader'
import { routes } from '@shared/constants'
import { USER_ROLES } from '@entities/user'
import { AccessDenied } from '@pages/403'
import { useEffect } from 'react'

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

interface AuthProviderProps {
  children: React.ReactNode
  strictTo?: UserRole
}

export const AuthProvider = ({ children, strictTo }: AuthProviderProps) => {
  const navigate = useNavigate()
  const { data, isLoading } = useGetMe()

  useEffect(() => {
    if (!isLoading && data?.status !== 'success') {
      navigate(routes.login)
    }
  }, [data, isLoading, navigate])

  if (isLoading) return <Loader />

  if (strictTo && data?.data.user.role !== strictTo) {
    return <AccessDenied />
  }

  return <>{children}</>
}
