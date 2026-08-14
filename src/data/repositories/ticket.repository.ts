import { api } from '../api/apiClient'
import type {
  TicketDetail,
  TicketSummary,
  PurchaseTicketRequest,
  ValidateTicketResponse,
} from '../../domain/types/ticket.types'

export const ticketRepository = {
  purchase: (eventId: string, payload: PurchaseTicketRequest) => api.post<TicketSummary>(`/api/events/${eventId}/tickets`, payload),
  getById: (id: string) => api.get<TicketDetail>(`/api/tickets/${id}`),
  validate: (code: string) => api.post<ValidateTicketResponse>(`/api/tickets/${code}/validate`),
} as const
