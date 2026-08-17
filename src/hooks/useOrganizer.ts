import { useSuspenseQuery } from '@tanstack/react-query'
import { organizerRepository } from '../data/repositories/organizer.repository'

export const useOrganizerEvents = () =>
  useSuspenseQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      const { data } = await organizerRepository.listEvents()
      return data.data
    },
  })

export const useOrganizerStats = () =>
  useSuspenseQuery({
    queryKey: ['organizer-stats'],
    queryFn: async () => {
      const { data } = await organizerRepository.getStats()
      return data
    },
  })
