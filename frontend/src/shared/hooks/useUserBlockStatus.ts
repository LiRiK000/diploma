import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'
import { getUserBlockInfo, type UserBlockInfo } from '@shared/utils/userBlockStatus'

export function useUserBlockStatus(): UserBlockInfo {
  const { data } = useGetMe()
  const user = data?.status === 'success' ? data.data : null
  return getUserBlockInfo(user)
}
