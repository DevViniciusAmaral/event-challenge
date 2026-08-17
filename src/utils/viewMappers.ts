import type { EventSummary, EventDetail, EventItem, EventMovie } from '#/domain/types/event.types'
import type { OrganizerEventSummary } from '#/domain/types/organizer.types'
import type { TicketEventInfo } from '#/domain/types/ticket.types'

type AnyRecord = Record<string, unknown>

const pickStr = (obj: AnyRecord, keys: string[]): string => {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.length > 0) return v
    if (typeof v === 'number') return String(v)
  }
  return ''
}

const pickNum = (obj: AnyRecord, keys: string[]): number => {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'number' && !Number.isNaN(v)) return v
    if (typeof v === 'string' && v.length > 0) {
      const n = Number(v)
      if (!Number.isNaN(n)) return n
    }
  }
  return 0
}

const normalizeMovie = (src: AnyRecord): EventMovie => {
  const movieVal = src.movie
  if (movieVal && typeof movieVal === 'object') {
    const m = movieVal as AnyRecord
    return {
      name: pickStr(m, ['name', 'title']),
      description: pickStr(m, ['description']),
    }
  }
  return {
    name: pickStr(src, ['title']),
    description: pickStr(src, ['description']),
  }
}

const normalizeHours = (src: AnyRecord): string => pickStr(src, ['hours', 'time'])

const normalizeLocal = (src: AnyRecord): string => pickStr(src, ['local', 'venue', 'address'])

const normalizeStatus = (src: AnyRecord): EventItem['status'] => {
  const v = src.status
  if (v === 'published' || v === 'draft') return v
  return 'draft'
}

export function mapEventSummaryToEventItem(
  summary: EventSummary,
  detail?: EventDetail,
): EventItem {
  const summaryAny = summary as any
  const availableTickets =
    pickNum(summaryAny, ['availables', 'availableTickets'])

  const source = (detail || summary) as any

  return {
    id: String(summaryAny.id ?? ''),
    movie: normalizeMovie(source),
    date: pickStr(source, ['date']),
    hours: normalizeHours(source),
    local: normalizeLocal(source),
    capacity: pickNum(source, ['capacity']),
    price: pickNum(source, ['price', 'ticketPrice']),
    status: normalizeStatus(source),
    availableTickets,
    organizerId: detail ? String((detail as any).organizerId ?? '') : '',
    createdAt: pickStr(source, ['createdAt']),
    updatedAt: pickStr(source, ['updatedAt']),
  }
}

export function mapEventDetailToEventItem(detail: EventDetail): EventItem {
  return mapEventSummaryToEventItem(detail, detail)
}

export function mapOrganizerEventToEventItem(
  orgEvent: OrganizerEventSummary,
): EventItem {
  const src = orgEvent as any
  const capacity = pickNum(src, ['capacity'])
  const availableTickets = pickNum(src, ['availables', 'availableTickets'])

  return {
    id: pickStr(src, ['id']),
    movie: normalizeMovie(src),
    date: pickStr(src, ['date']),
    hours: normalizeHours(src),
    local: normalizeLocal(src),
    capacity,
    price: pickNum(src, ['price', 'ticketPrice']),
    status: normalizeStatus(src),
    availableTickets,
    organizerId: '',
    createdAt: pickStr(src, ['createdAt']),
    updatedAt: pickStr(src, ['updatedAt']),
  }
}

export function mapTicketEventInfo(src: TicketEventInfo): TicketEventInfo {
  const raw = src as unknown as AnyRecord
  return {
    id: pickStr(raw, ['id']),
    movie: normalizeMovie(raw),
    date: pickStr(raw, ['date']),
    hours: normalizeHours(raw),
    local: normalizeLocal(raw),
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
