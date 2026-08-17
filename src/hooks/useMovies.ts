import { useSuspenseQuery } from '@tanstack/react-query'
import { movieRepository } from '../data/repositories/movie.repository'
import type { MovieCatalogItem } from '../types/event.types'

export const MOVIES_PREFIX = ['movies'] as const

export const useMovies = () =>
  useSuspenseQuery<MovieCatalogItem[]>({
    queryKey: MOVIES_PREFIX,
    queryFn: async () => {
      const { data } = await movieRepository.listAll()
      return data
    },
  })
