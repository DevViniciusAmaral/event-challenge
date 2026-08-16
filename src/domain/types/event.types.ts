export type EventStatus = 'draft' | 'published'
export type EventType = 'show' | 'cinema'

export interface EventItem {
  id: string
  catalogId: string
  title: string
  description: string
  date: string
  time: string
  location: string
  address: string
  price: number
  capacity: number
  available: number
  image: string
  type: EventType
}

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
