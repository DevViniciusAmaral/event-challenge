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
import { successToast, errorToast } from '../../components/ui/toaster'

const EVENT_LIST_KEYS = ['list-events'] as const
const EVENT_DETAIL_KEYS = ['event-detail'] as const
const ORGANIZER_KEYS = ['organizer-events', 'organizer-stats'] as const

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
  UseMutationOptions<EventSummary, Error, CreateEventRequest>,
  'mutationFn'
>

export const useCreateEvent = (options?: CreateEventOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (payload: CreateEventRequest) => {
      const { data } = await eventRepository.create(payload)
      return data
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: EVENT_LIST_KEYS, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_KEYS, refetchType: 'all' })
      successToast('Evento criado com sucesso')
      options?.onSuccess?.(data, variables, ctx)

    },
    onError: (err, variables, ctx) => {
      errorToast('Erro ao criar evento')
      options?.onError?.(err, variables, ctx)
    },
    ...options
  })
}

type PublishEventOptions = Omit<
  UseMutationOptions<EventSummary, Error, string>,
  'mutationFn'
>

export const usePublishEvent = (options?: PublishEventOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: async (eventId: string) => {
      const { data } = await eventRepository.publish(eventId)
      return data
    },
    onSuccess: (data, eventId, ctx) => {
      queryClient.invalidateQueries({ queryKey: EVENT_LIST_KEYS, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: [...EVENT_DETAIL_KEYS, eventId], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_KEYS, refetchType: 'all' })
      successToast('Evento publicado')
      options?.onSuccess?.(data, eventId, ctx)
    },
    onError: (err, variables, ctx) => {
      errorToast('Erro ao publicar evento')
      options?.onError?.(err, variables, ctx)
    },
    ...options
  })
}

type DeleteEventOptions = Omit<
  UseMutationOptions<unknown, Error, string>,
  'mutationFn'
>

export const useDeleteEvent = (options?: DeleteEventOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (eventId: string) => eventRepository.delete(eventId),
    onSuccess: (data, eventId, ctx) => {
      queryClient.invalidateQueries({ queryKey: EVENT_LIST_KEYS, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: [...EVENT_DETAIL_KEYS, eventId], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ORGANIZER_KEYS, refetchType: 'all' })
      successToast('Evento excluído', 'O evento foi removido permanentemente.')
      options?.onSuccess?.(data, eventId, ctx)
    },
    onError: (err, variables, ctx) => {
      errorToast('Erro ao excluir evento')
      options?.onError?.(err, variables, ctx)
    },
  })
}
