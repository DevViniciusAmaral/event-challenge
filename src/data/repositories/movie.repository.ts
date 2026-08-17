import type { MovieCatalogItem } from '../../domain/types/event.types'
import { api } from '../api/apiClient'

export const movieRepository = {
  listAll: () => api.get<MovieCatalogItem[]>('/api/movies'),
} as const
