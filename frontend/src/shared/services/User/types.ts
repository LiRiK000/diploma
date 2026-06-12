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
  isSuspended: boolean
  suspendedUntil: string | null
  banReason: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateMePayload {
  name?: string
  surname?: string
  displayName?: string
  phone?: string
  gender?: Gender | null
  birthDate?: string | null
  avatarUrl?: string
}
