import { useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { eventRepository } from '../../data/repositories/event.repository'
import type { CreateEventRequest } from '../../domain/types/event.types'
import { successToast, errorToast } from '../../components/ui/toaster'

export const usePublishedEvents = (search?: string) =>
  useSuspenseQuery({
    queryKey: ['list-events', search],
    queryFn: async () => {
      const { data } = await eventRepository.listPublished(search)
      return data
    },
  })

export const useEventById = (id: string) =>
  useSuspenseQuery({
    queryKey: ['event-detail', id],
    queryFn: async () => {
      const { data } = await eventRepository.getById(id)
      return data
    },
  })

export const useCreateEvent = () => useMutation({
  mutationFn: async (payload: CreateEventRequest) => {
    const { data } = await eventRepository.create(payload)
    return data
  },
  onSuccess: () => {
    successToast('Evento criado com sucesso')
  },
  onError: () => {
    errorToast('Erro ao criar evento')
  },
})

export const usePublishEvent = () => useMutation({
  mutationFn: async (eventId: string) => {
    const { data } = await eventRepository.publish(eventId)
    return data
  },
  onSuccess: () => {
    successToast('Evento publicado')
  },
  onError: () => {
    errorToast('Erro ao publicar evento')
  },
})

export const useDeleteEvent = () => useMutation({
  mutationFn: (eventId: string) => eventRepository.delete(eventId),
  onSuccess: () => {
    successToast('Evento excluído', 'O evento foi removido permanentemente.')
  },
  onError: () => {
    errorToast('Erro ao excluir evento')
  },
})
