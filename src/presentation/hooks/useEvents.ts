import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { eventRepository } from '../../data/repositories/event.repository'
import type {
  EventListResponse,
  EventDetail,
  CreateEventRequest,
} from '../../domain/types/event.types'
import {
  successToast,
  errorToast,
  extractBackendMessage,
} from '../../components/ui/toaster'

const queryKeys = {
  all: ['events'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (search?: string) => [...queryKeys.lists(), { search }] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
}

const organizerQueryKeys = {
  all: ['organizer'] as const,
  events: () => [...organizerQueryKeys.all, 'events'] as const,
  stats: () => [...organizerQueryKeys.all, 'stats'] as const,
}

export function usePublishedEvents(
  search?: string,
  options?: Omit<UseQueryOptions<EventListResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.list(search),
    queryFn: async () => {
      const { data } = await eventRepository.listPublished(search)
      return data
    },
    ...options,
  })
}

export function useEventById(
  id: string,
  options?: Omit<UseQueryOptions<EventDetail, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: async () => {
      const { data } = await eventRepository.getById(id)
      return data
    },
    enabled: Boolean(id),
    ...options,
  })
}

export function useCreateEvent(
  options?: Omit<
    UseMutationOptions<EventDetail, Error, CreateEventRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: async (payload: CreateEventRequest) => {
      const { data } = await eventRepository.create(payload)
      return data
    },
    onSuccess: async (data, variables, ctx) => {
      queryClient.setQueryData(queryKeys.detail(data.id), data)

      queryClient.invalidateQueries({ queryKey: queryKeys.all })
      queryClient.invalidateQueries({ queryKey: organizerQueryKeys.all })

      await Promise.allSettled([
        queryClient.refetchQueries({ queryKey: queryKeys.all, type: 'active' }),
        queryClient.refetchQueries({ queryKey: organizerQueryKeys.all, type: 'active' }),
      ])

      successToast('Evento criado com sucesso', `O evento "${data.title}" foi salvo.`)

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnSuccess?.(data, variables, ctx)
    },
    onError: async (err, variables, ctx) => {
      errorToast('Erro ao criar evento', extractBackendMessage(err))

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnError?.(err, variables, ctx)
    },
    ...restOptions,
  })
}

export function usePublishEvent(
  options?: Omit<UseMutationOptions<EventDetail, Error, string>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await eventRepository.publish(eventId)
      return data
    },
    onSuccess: async (data, eventId, ctx) => {
      queryClient.setQueryData(queryKeys.detail(eventId), data)

      queryClient.invalidateQueries({ queryKey: queryKeys.all })
      queryClient.invalidateQueries({ queryKey: organizerQueryKeys.all })

      await Promise.allSettled([
        queryClient.refetchQueries({ queryKey: queryKeys.all, type: 'active' }),
        queryClient.refetchQueries({ queryKey: organizerQueryKeys.all, type: 'active' }),
      ])

      successToast('Evento publicado', `O evento "${data.title}" está disponível para venda.`)

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnSuccess?.(data, eventId, ctx)
    },
    onError: async (err, eventId, ctx) => {
      errorToast('Erro ao publicar evento', extractBackendMessage(err))

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnError?.(err, eventId, ctx)
    },
    ...restOptions,
  })
}

export function useDeleteEvent(
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: async (eventId: string) => {
      await eventRepository.delete(eventId)
    },
    onSuccess: async (_data, eventId, ctx) => {
      queryClient.removeQueries({ queryKey: queryKeys.detail(eventId) })

      queryClient.invalidateQueries({ queryKey: queryKeys.all })
      queryClient.invalidateQueries({ queryKey: organizerQueryKeys.all })

      await Promise.allSettled([
        queryClient.refetchQueries({ queryKey: queryKeys.all, type: 'active' }),
        queryClient.refetchQueries({ queryKey: organizerQueryKeys.all, type: 'active' }),
      ])

      successToast('Evento excluído', 'O evento foi removido permanentemente.')

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnSuccess?.(undefined as void, eventId, ctx)
    },
    onError: async (err, eventId, ctx) => {
      console.log()
      errorToast('Erro ao excluir evento', extractBackendMessage(err))

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnError?.(err, eventId, ctx)
    },
    ...restOptions,
  })
}
