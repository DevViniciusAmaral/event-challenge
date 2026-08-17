import type { EventMovie, EventStatus } from './event.types'

export interface OrganizerStats {
  totalEvents: number
  publishedEvents: number
  totalTicketsSold: number
  totalRevenue: number
  upcomingEvents: number
}

export interface OrganizerEventSummary {
  id: string
  movie: EventMovie
  date: string
  hours: string
  local: string
  capacity: number
  price: number
  status: EventStatus
  availableTickets: number
  ticketsSold?: number
  availables?: number
  ticketsSoldCount?: number
  totalRevenue?: number
  createdAt: string
  updatedAt: string
}

export interface OrganizerEventListResponse {
  data: OrganizerEventSummary[]
  total: number
}
