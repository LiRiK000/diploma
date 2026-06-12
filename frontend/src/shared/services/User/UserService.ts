import { api } from '@shared/api'
import type { UpdateMePayload, UserProfile } from './types'

export interface UploadAvatarResponse {
  status: string
  avatarUrl: string | null
}

export class UserService {
  async getMe(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/user/profile')
    return data
  }

  async updateMe(payload: UpdateMePayload): Promise<UserProfile> {
    const { data } = await api.patch<UserProfile>('/user/profile', payload)
    return data
  }

  async uploadAvatar(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await api.post<UploadAvatarResponse>(
      '/user/avatar',
      formData,
    )

    return data.avatarUrl
  }
}

export const userService = new UserService()
