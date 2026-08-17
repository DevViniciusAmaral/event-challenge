import type { EventSummary, EventDetail, EventItem } from '#/domain/types/event.types'
import type { OrganizerEventSummary } from '#/domain/types/organizer.types'

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=80'

export function mapEventSummaryToEventItem(
  summary: EventSummary,
  detail?: EventDetail,
): EventItem {
  const availableTickets =
    Number((summary as EventSummary & { availables?: number }).availables) ||
    Number(summary.availableTickets) ||
    0

  const source = detail || summary

  return {
    id: summary.id,
    movie: source.movie,
    date: source.date,
    hours: source.hours,
    local: source.local,
    capacity: source.capacity,
    price: source.price,
    status: source.status,
    availableTickets,
    organizerId: detail?.organizerId || '',
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  }
}

export function mapEventDetailToEventItem(detail: EventDetail): EventItem {
  return mapEventSummaryToEventItem(detail, detail)
}

export function mapOrganizerEventToEventItem(
  orgEvent: OrganizerEventSummary,
): EventItem {
  const capacity = Number(orgEvent.capacity) || 0
  const available =
    Number(orgEvent.availables) ||
    (typeof orgEvent.availableTickets === 'number'
      ? Number(orgEvent.availableTickets)
      : 0)

  return {
    id: orgEvent.id,
    movie: orgEvent.movie,
    date: orgEvent.date,
    hours: orgEvent.hours,
    local: orgEvent.local,
    capacity,
    price: orgEvent.price,
    status: orgEvent.status,
    availableTickets: available,
    organizerId: '',
    createdAt: orgEvent.createdAt,
    updatedAt: orgEvent.updatedAt,
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
