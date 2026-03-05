// features/update-preferences/model/usePreferences.ts
import { useState } from 'react'

export const usePreferences = (initialSelected: number[] = []) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected)

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
    // Здесь в будущем будет вызов API для подгрузки похожих авторов
  }

  return {
    selectedIds,
    toggleSelection,
  }
}
