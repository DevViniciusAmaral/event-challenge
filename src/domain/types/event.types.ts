export type EventStatus = 'draft' | 'published'
export type EventType = 'show' | 'cinema'

export interface EventMovie {
  name: string
  description: string
}

export interface EventItem {
  id: string
  movie: EventMovie
  date: string
  hours: string
  local: string
  capacity: number
  price: number
  status: EventStatus
  availableTickets: number
  organizerId: string
  createdAt: string
  updatedAt: string
}

export interface EventSummary {
  id: string
  movie: EventMovie
  date: string
  hours: string
  local: string
  capacity: number
  price: number
  status: EventStatus
  availableTickets: number
  createdAt: string
  updatedAt: string
}

export interface EventDetail extends EventSummary {
  organizerId: string
}

export interface EventListResponse {
  data: EventSummary[]
  total: number
}

export interface CreateEventRequest {
  movie: EventMovie
  date: string
  hours: string
  local: string
  capacity: number
  price: number
}

export interface MovieCatalogItem {
  name: string
  description: string
}
