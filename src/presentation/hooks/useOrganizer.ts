import {
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { organizerRepository } from '../../data/repositories/organizer.repository'
import type {
  OrganizerStats,
  OrganizerEventListResponse,
} from '../../domain/types/organizer.types'

const queryKeys = {
  all: ['organizer'] as const,
  events: () => [...queryKeys.all, 'events'] as const,
  stats: () => [...queryKeys.all, 'stats'] as const,
}

export function useOrganizerEvents(
  options?: Omit<
    UseQueryOptions<OrganizerEventListResponse, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.events(),
    queryFn: async () => {
      const { data } = await organizerRepository.listEvents()
      return data
    },
    ...options,
  })
}

export function useOrganizerStats(
  options?: Omit<UseQueryOptions<OrganizerStats, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stats(),
    queryFn: async () => {
      const { data } = await organizerRepository.getStats()
      return data
    },
    ...options,
  })
}
