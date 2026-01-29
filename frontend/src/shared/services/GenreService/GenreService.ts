import { api } from '@shared/api'

export interface Genre {
  id: string
  label: string
  value: string
}

export class GenreService {
  async getAll(): Promise<Genre[]> {
    const response = await api.get('/genres')
    return response.data.data
  }
}
