import type {
  EventListResponse,
  EventDetail,
  CreateEventRequest,
} from '../../domain/types/event.types'
import { api } from '../api/apiClient'

export const eventRepository = {
  listPublished: (search?: string) => api.get<EventListResponse>('/api/events', {
    params: search ? { search } : undefined,
  }),
  getById: (id: string) => api.get<EventDetail>(`/api/events/${id}`),
  create: (payload: CreateEventRequest) => api.post<EventDetail>('/api/events', payload),
  publish: (id: string) => api.patch<EventDetail>(`/api/events/${id}/publish`),
  delete: (id: string) => api.delete<void>(`/api/events/${id}`),
} as const
