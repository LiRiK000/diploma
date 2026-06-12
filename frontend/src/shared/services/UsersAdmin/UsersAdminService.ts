import { api } from '@shared/api'
import type {
  BlacklistUserPayload,
  ManagedUser,
  SuspendUserPayload,
} from './types'

export class UsersAdminService {
  async getAll(): Promise<ManagedUser[]> {
    const { data } = await api.get<ManagedUser[]>('/users')
    return data
  }

  async blacklist(userId: string, payload: BlacklistUserPayload): Promise<ManagedUser> {
    const { data } = await api.post<ManagedUser>(
      `/users/${userId}/blacklist`,
      payload,
    )
    return data
  }

  async suspend(userId: string, payload: SuspendUserPayload): Promise<ManagedUser> {
    const { data } = await api.post<ManagedUser>(
      `/users/${userId}/suspend`,
      payload,
    )
    return data
  }

  async unblock(userId: string): Promise<ManagedUser> {
    const { data } = await api.post<ManagedUser>(`/users/${userId}/unblock`)
    return data
  }
}

export const usersAdminService = new UsersAdminService()
