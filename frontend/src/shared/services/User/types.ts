import type { Gender, UserRole } from '@shared/services/Auth/types'

export interface UserProfile {
  id: string
  email: string
  name: string
  surname: string
  displayName: string | null
  phone: string | null
  role: UserRole
  gender: Gender | null
  birthDate: string | null
  avatarUrl: string | null
  isInBlacklist: boolean
  createdAt: string
  updatedAt: string
}

export interface GetMeResponse {
  status: 'success' | 'error'
  data: {
    user: UserProfile
  }
}

export interface UpdateMePayload {
  name?: string
  surname?: string
  displayName?: string
  phone?: string
  gender?: Gender
  birthDate?: string
  avatarUrl?: string
}

export interface UpdateMeResponse {
  status: 'success' | 'error'
  data: {
    user: UserProfile
  }
}
