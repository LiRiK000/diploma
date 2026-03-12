import { api } from '@shared/api'
import type { GetMeResponse, UpdateMePayload, UpdateMeResponse } from './types'

export class UserService {
  async getMe(): Promise<GetMeResponse> {
    const response = await api.get<GetMeResponse>('/auth/me')
    return response.data
  }

  async updateMe(payload: UpdateMePayload): Promise<UpdateMeResponse> {
    const response = await api.patch<UpdateMeResponse>('/auth/me', payload)
    return response.data
  }
}
