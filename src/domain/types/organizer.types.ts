export interface OrganizerStats {
  totalEvents: number
  publishedEvents: number
  totalTicketsSold: number
  totalRevenue: number
  upcomingEvents: number
}

export interface OrganizerEventSummary {
  id: string
  title: string
  status: 'draft' | 'published'
  date: string
  time: string
  venue: string
  capacity: number
  ticketPrice: number
  ticketsSold?: number
  availableTickets?: number
  availables?: number
  ticketsSoldCount?: number
  totalRevenue?: number
  imageUrl?: string
  description?: string
  address?: string
}

export interface OrganizerEventListResponse {
  data: OrganizerEventSummary[]
  total: number
}
