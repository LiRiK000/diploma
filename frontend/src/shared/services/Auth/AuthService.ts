import { api } from '@shared/api'
import { RegisterRequestData, LoginFormValues, MeResponse } from './types'

export class AuthService {
  async register(data: RegisterRequestData) {
    const response = await api.post('/api/auth/register', data)
    return response.data
  }
  async login(data: LoginFormValues) {
    const response = await api.post('/api/auth/login', data)
    return response.data
  }
  async logout() {
    const response = await api.post('/api/auth/logout')
    return response.data
  }
  async refreshTokens() {
    const response = await api.post('/api/auth/refresh-tokens')
    return response.data
  }
  async getMe() {
    const response = await api.get<MeResponse>('/api/auth/me')
    return response.data
  }
}
