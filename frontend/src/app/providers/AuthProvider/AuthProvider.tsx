import { useNavigate } from 'react-router-dom'
import { useGetMe } from './hooks/useGetMe'
import { Loader } from '@shared/components/Loader'
import { routes } from '@shared/constants'
import { USER_ROLES } from '@entities/user'
import { AccessDenied } from '@pages/403'

export const AuthProvider = ({
  children,
  strictTo,
}: {
  children: React.ReactNode
  strictTo?: (typeof USER_ROLES)[keyof typeof USER_ROLES]
}) => {
  const navigate = useNavigate()

  const { data, isLoading } = useGetMe()

  if (isLoading) return <Loader />

  if (data?.status !== 'success') {
    navigate(routes.login)
  }

  if (strictTo && data?.data.user.role !== strictTo) {
    return <AccessDenied />
  }

  return <div>{children}</div>
}
