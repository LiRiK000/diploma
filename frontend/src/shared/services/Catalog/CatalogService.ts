import { api } from '@shared/api'
import { GetCatalogParams, CatalogResponse } from './catalog.types'

export class CatalogService {
  async getCatalog(params: GetCatalogParams): Promise<CatalogResponse> {
    const response = await api.get<CatalogResponse>('/catalog', {
      params,
    })

    return response.data
  }
}

export const catalogService = new CatalogService()
