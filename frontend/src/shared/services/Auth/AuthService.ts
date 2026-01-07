import { api } from '@shared/api'
import { RegisterRequestData, LoginFormValues, MeResponse } from './types'

export class AuthService {
  async register(data: RegisterRequestData) {
    const response = await api.post('/auth/register', data)
    return response.data
  }
  async login(data: LoginFormValues) {
    const response = await api.post('/auth/login', data)
    return response.data
  }
  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  }
  async refreshTokens() {
    const response = await api.post('/auth/refresh-tokens')
    return response.data
  }
  async getMe() {
    const response = await api.get<MeResponse>('/auth/me')
    return response.data
  }
}
