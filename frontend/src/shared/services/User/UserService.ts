import { api } from '@shared/api'
import type { GetMeResponse, UpdateMePayload, UpdateMeResponse } from './types'

export interface UploadAvatarResponse {
  status: string
  avatarUrl: string | null
}

export class UserService {
  async getMe(): Promise<GetMeResponse> {
    const response = await api.get<GetMeResponse>('/user/profile')
    return response.data
  }

  async updateMe(payload: UpdateMePayload): Promise<UpdateMeResponse> {
    const response = await api.patch<UpdateMeResponse>('/user/profile', payload)
    return response.data
  }

  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadAvatarResponse>(
      '/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  }
}

export const userService = new UserService()
