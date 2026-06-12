export type UserBlockType = 'blacklist' | 'suspended' | null

export interface UserBlockInfo {
  isBlocked: boolean
  type: UserBlockType
  reason: string | null
  until: Date | null
}

export interface UserBlockFields {
  isInBlacklist?: boolean
  isSuspended?: boolean
  suspendedUntil?: string | null
  banReason?: string | null
}

export function getUserBlockInfo(user?: UserBlockFields | null): UserBlockInfo {
  if (!user) {
    return { isBlocked: false, type: null, reason: null, until: null }
  }

  const now = new Date()

  if (user.isInBlacklist) {
    return {
      isBlocked: true,
      type: 'blacklist',
      reason: user.banReason ?? null,
      until: null,
    }
  }

  if (user.isSuspended && user.suspendedUntil) {
    const until = new Date(user.suspendedUntil)
    if (until > now) {
      return {
        isBlocked: true,
        type: 'suspended',
        reason: user.banReason ?? null,
        until,
      }
    }
  }

  return { isBlocked: false, type: null, reason: null, until: null }
}

export function getBlockActionTooltip(blockInfo: UserBlockInfo): string {
  if (!blockInfo.isBlocked) return ''

  if (blockInfo.type === 'blacklist') {
    return blockInfo.reason
      ? `Аккаунт заблокирован. Причина: ${blockInfo.reason}`
      : 'Аккаунт заблокирован'
  }

  const until = blockInfo.until?.toLocaleDateString('ru-RU') ?? ''
  return blockInfo.reason
    ? `Аккаунт заморожен до ${until}. Причина: ${blockInfo.reason}`
    : `Аккаунт заморожен до ${until}`
}
