import { create } from 'zustand'

interface ILibrarianSettingsState {
  isEditing: boolean
  toggleEditing: () => void
}

export const useLibrarianSettingsStore = create<ILibrarianSettingsState>(
  set => ({
    isEditing: false,
    toggleEditing: () => set(state => ({ isEditing: !state.isEditing })),
  }),
)
