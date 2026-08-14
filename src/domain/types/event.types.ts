export type EventStatus = 'draft' | 'published'

export interface EventSummary {
  id: string
  title: string
  status: EventStatus
  ticketPrice: number
  availableTickets: number
  availables: number
}

export interface EventDetail extends EventSummary {
  description: string
  imageUrl?: string
  date: string
  time: string
  venue: string
  address: string
  capacity: number
  ticketsSold: number
  organizerId: string
}

export interface EventListResponse {
  data: EventSummary[]
  total: number
}

export interface CreateEventRequest {
  title: string
  description: string
  imageUrl?: string
  date: string
  time: string
  venue: string
  address: string
  capacity: number
  ticketPrice: number
}
