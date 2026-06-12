export interface RegisterFormValues {
  email: string
  password: string
  passwordConfirm: string
  name: string
  surname: string
}

export interface RegisterRequestData {
  email: string
  password: string
  name: string
  surname: string
}

export interface LoginFormValues {
  email: string
  password: string
}

export type UserRole = 'LIBRARIAN' | 'USER' | 'ADMIN'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export interface User {
  id: string
  email: string
  name: string
  surname: string
  displayName: string | null
  phone: string | null
  role: UserRole
  gender: Gender | null
  birthDate?: string | null
  avatarUrl: string | null
  isInBlacklist: boolean
  isSuspended?: boolean
  suspendedUntil?: string | null
  banReason?: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  surname?: string
  phone?: string | null
  birthDate?: string | null
  role: UserRole
  isInBlacklist?: boolean
  isSuspended?: boolean
  suspendedUntil?: string | null
  banReason?: string | null
  createdAt?: string
}

export interface MeResponse {
  status: 'success' | 'error'
  data: AuthUser
}

export interface AuthResponse {
  status: 'success' | 'error'
  data: {
    id: string
    email: string
    role: UserRole
  }
}
