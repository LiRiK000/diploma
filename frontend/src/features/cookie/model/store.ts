// TODO: переделать на запросы к API
import { create } from 'zustand'

const CONSENT_KEY = 'cookies_consent_v1'

interface ICookieConsentState {
  consent: string | null
  accept: () => void
  revoke: () => void
  init: () => void
}

export const useCookieConsentStore = create<ICookieConsentState>(set => ({
  consent: null,
  init: () => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY)
      set({ consent: saved })
    } catch {
      set({ consent: null })
    }
  },
  accept: () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted')
    } catch {
      // localStorage not available
    }
    set({ consent: 'accepted' })
  },
  revoke: () => {
    try {
      localStorage.removeItem(CONSENT_KEY)
    } catch {
      // localStorage not available
    }
    set({ consent: null })
  },
}))
