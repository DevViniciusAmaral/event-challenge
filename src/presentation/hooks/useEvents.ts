import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { eventRepository } from '../../data/repositories/event.repository'
import type {
  CreateEventRequest,
  EventDetail,
  EventSummary,
} from '../../domain/types/event.types'
import {
  successToast,
  errorToast,
  extractBackendMessage,
} from '../../components/ui/toaster'

const EVENT_LIST_PREFIX = ['list-events'] as const
const EVENT_DETAIL_PREFIX = ['event-detail'] as const
const ORGANIZER_EVENTS_PREFIX = ['organizer-events'] as const
const ORGANIZER_STATS_PREFIX = ['organizer-stats'] as const

export const usePublishedEvents = (search?: string) =>
  useSuspenseQuery({
    queryKey: ['list-events', search],
    queryFn: async () => {
      const { data } = await eventRepository.listPublished(search)
      return data
    },
  })

export const useEventById = (id: string) =>
  useSuspenseQuery<EventDetail>({
    queryKey: ['event-detail', id],
    queryFn: async () => {
      const { data } = await eventRepository.getById(id)
      return data
    },
  })

type CreateEventOptions = Omit<
  UseMutationOptions<EventSummary, Error, CreateEventRequest, unknown>,
  'mutationFn'
>

export const useCreateEvent = (options?: CreateEventOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...(options as any),
    mutationFn: async (payload: CreateEventRequest) => {
      const { data } = await eventRepository.create(payload)
      return data
    },
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: EVENT_LIST_PREFIX, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_EVENTS_PREFIX, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_STATS_PREFIX, refetchType: 'all' })
      successToast('Evento criado com sucesso')
      ;(options as any)?.onSuccess?.(...args)
    },
    onError: (...args: any[]) => {
      const err = args[0] as unknown
      errorToast('Erro ao criar evento', extractBackendMessage(err))
      ;(options as any)?.onError?.(...args)
    },
  })
}

type PublishEventOptions = Omit<
  UseMutationOptions<EventSummary, Error, string, unknown>,
  'mutationFn'
>

export const usePublishEvent = (options?: PublishEventOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...(options as any),
    mutationFn: async (eventId: string) => {
      const { data } = await eventRepository.publish(eventId)
      return data
    },
    onSuccess: (...args: any[]) => {
      const eventId = (args as any)[1] as string
      queryClient.invalidateQueries({ queryKey: EVENT_LIST_PREFIX, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: [...EVENT_DETAIL_PREFIX, eventId], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_EVENTS_PREFIX, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_STATS_PREFIX, refetchType: 'all' })
      successToast('Evento publicado')
      ;(options as any)?.onSuccess?.(...args)
    },
    onError: (...args: any[]) => {
      const err = args[0] as unknown
      errorToast('Erro ao publicar evento', extractBackendMessage(err))
      ;(options as any)?.onError?.(...args)
    },
  })
}

type DeleteEventOptions = Omit<
  UseMutationOptions<unknown, Error, string, unknown>,
  'mutationFn'
>

export const useDeleteEvent = (options?: DeleteEventOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...(options as any),
    mutationFn: (eventId: string) => eventRepository.delete(eventId),
    onSuccess: (...args: any[]) => {
      const eventId = (args as any)[1] as string
      queryClient.invalidateQueries({ queryKey: EVENT_LIST_PREFIX, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: [...EVENT_DETAIL_PREFIX, eventId], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_EVENTS_PREFIX, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_STATS_PREFIX, refetchType: 'all' })
      successToast('Evento excluído', 'O evento foi removido permanentemente.')
      ;(options as any)?.onSuccess?.(...args)
    },
    onError: (...args: any[]) => {
      const err = args[0] as unknown
      errorToast('Erro ao excluir evento', extractBackendMessage(err))
      ;(options as any)?.onError?.(...args)
    },
  })
}
