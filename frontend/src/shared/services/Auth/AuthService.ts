import { api } from '@shared/api'
import {
  AuthResponse,
  LoginFormValues,
  MeResponse,
  RegisterRequestData,
} from './types'

export class AuthService {
  async register(data: RegisterRequestData) {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  async login(data: LoginFormValues) {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  }

  async logout() {
    const response = await api.post<{ status: string; data: { message: string } }>(
      '/auth/logout',
    )
    return response.data
  }

  async refreshTokens() {
    const response = await api.post<AuthResponse>('/auth/refresh-token')
    return response.data
  }

  async getMe() {
    const response = await api.get<MeResponse>('/auth/me')
    return response.data
  }
}
