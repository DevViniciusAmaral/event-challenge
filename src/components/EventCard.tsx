import { Link } from '@tanstack/react-router'
import { formatDateTime, formatPrice } from '@/lib/utils'
import type { EventItem } from '#/domain/types/event.types'
import { Film } from 'lucide-react'

interface EventCardProps {
  event: EventItem
}

export function EventCard({ event }: EventCardProps) {
  const soldOut = event.availableTickets <= 0

  return (
    <div className="group relative flex flex-col overflow-hidden bg-white border border-zinc-200 rounded-lg">
      <div className="aspect-video w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 group-hover:opacity-95 transition-opacity relative flex items-center justify-center overflow-hidden">
        <Film className="h-16 w-16 text-white/20" strokeWidth={1.5} />
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 14px)',
          }}
        />
        <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white/10 backdrop-blur px-2.5 py-0.5 text-[11px] font-medium text-white/90 border border-white/10">
          Cinema
        </div>
        {soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Esgotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">
            {event.availableTickets > 0
              ? `${event.availableTickets} disponíveis`
              : 'Esgotado'}
          </span>
        </div>

        <h3 className="text-base font-medium text-zinc-950 line-clamp-1 mb-2">
          {event.movie.name}
        </h3>

        <p className="text-xs text-zinc-500 line-clamp-2 flex-grow mb-4">
          {event.movie.description}
        </p>

        <div className="border-t border-zinc-100 pt-4 mt-auto flex items-center justify-between">
          <div className="text-xs text-zinc-500 space-y-0.5">
            <div>{formatDateTime(event.date, event.hours)}</div>
            <div className="line-clamp-1">{event.local}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-zinc-900">
              {formatPrice(event.price)}
            </div>
          </div>
        </div>

        <Link
          to="/events/$id"
          params={{ id: event.id }}
          className={`mt-4 block w-full rounded py-2 text-center text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !soldOut
              ? 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900'
              : 'bg-zinc-200 text-zinc-500 hover:bg-zinc-300 focus:ring-zinc-400 cursor-not-allowed'
          }`}
        >
          {!soldOut ? 'Visualizar Evento' : 'Indisponível'}
        </Link>
      </div>
    </div>
  )
}
