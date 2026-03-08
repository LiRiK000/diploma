import { useQuery } from '@tanstack/react-query'
import { catalogService } from '@shared/services/Catalog'
import {
  CatalogResponse,
  GetCatalogParams,
} from '@shared/services/Catalog/catalog.types'

export const useCatalog = (params: GetCatalogParams) => {
  return useQuery<CatalogResponse>({
    queryKey: ['catalog', params],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return catalogService.getCatalog(params)
    },
  })
}
