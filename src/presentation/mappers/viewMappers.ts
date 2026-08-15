import type { EventSummary, EventDetail } from '#/domain/types/event.types'
import type { OrganizerEventSummary } from '#/domain/types/organizer.types'

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=80'

export function mapEventSummaryToEventItem(
  summary: EventSummary,
  detail?: EventDetail,
) {
  const availableTickets =
    Number((summary as EventSummary & { availables?: number }).availables) ||
    Number(summary.availableTickets) ||
    0

  return {
    id: summary.id,
    catalogId: '',
    title: summary.title,
    description: detail?.description || '',
    date: detail?.date || '',
    time: detail?.time || '',
    location: detail?.venue || '',
    address: detail?.address || '',
    price: summary.ticketPrice,
    capacity: detail?.capacity ?? availableTickets,
    available: availableTickets,
    image: detail?.imageUrl || DEFAULT_IMAGE,
    type: 'show',
  }
}

export function mapEventDetailToEventItem(detail: EventDetail) {
  return mapEventSummaryToEventItem(detail, detail)
}

export function mapOrganizerEventToEventItem(
  orgEvent: OrganizerEventSummary,
) {
  const capacity = Number(orgEvent.capacity) || 0
  const ticketPrice = Number(orgEvent.ticketPrice) || 0

  const ticketsSold =
    Number(orgEvent.ticketsSold) ||
    Number(orgEvent.ticketsSoldCount) ||
    (typeof orgEvent.availableTickets === 'number'
      ? Math.max(0, capacity - Number(orgEvent.availableTickets))
      : 0)

  const available =
    Number(orgEvent.availables) ||
    (typeof orgEvent.availableTickets === 'number'
      ? Number(orgEvent.availableTickets)
      : Math.max(0, capacity - ticketsSold))

  return {
    id: orgEvent.id,
    catalogId: '',
    title: orgEvent.title,
    description: orgEvent.description || '',
    date: orgEvent.date,
    time: orgEvent.time,
    location: orgEvent.venue,
    address: orgEvent.address || '',
    price: ticketPrice,
    capacity,
    available,
    image: orgEvent.imageUrl || DEFAULT_IMAGE,
    type: 'show',
  }
}

export function mapStats(
  stats:
    | {
      totalEvents: number
      publishedEvents: number
      totalTicketsSold: number
      totalRevenue: number
      upcomingEvents: number
    }
    | null
    | undefined,
) {
  return {
    totalEvents: Number(stats?.totalEvents) || 0,
    publishedEvents: Number(stats?.publishedEvents) || 0,
    totalTicketsSold: Number(stats?.totalTicketsSold) || 0,
    totalRevenue: Number(stats?.totalRevenue) || 0,
    upcomingEvents: Number(stats?.upcomingEvents) || 0,
  }
}
