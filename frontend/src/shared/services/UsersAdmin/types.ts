import type { UserRole } from '@shared/services/Auth/types'

export interface ManagedUser {
  id: string
  email: string
  name: string
  surname: string
  role: UserRole
  isInBlacklist: boolean
  isSuspended: boolean
  suspendedUntil: string | null
  banReason: string | null
  createdAt: string
}

export interface BlacklistUserPayload {
  banReason: string
}

export interface SuspendUserPayload {
  suspendedUntil: string
  banReason: string
}
