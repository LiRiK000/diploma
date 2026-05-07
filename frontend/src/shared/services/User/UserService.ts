import { api } from '@shared/api'
import type { GetMeResponse, UpdateMePayload, UpdateMeResponse } from './types'

export interface UploadAvatarResponse {
  status: string
  avatarUrl: string | null
}

export class UserService {
  async getMe(): Promise<GetMeResponse> {
    const { data } = await api.get<GetMeResponse>('/user/profile')
    return data
  }

  async updateMe(payload: UpdateMePayload): Promise<UpdateMeResponse> {
    const { data } = await api.patch<UpdateMeResponse>('/user/profile', payload)
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
