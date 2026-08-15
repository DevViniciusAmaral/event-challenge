import { Link } from '@tanstack/react-router'
import { formatDateTime, formatPrice } from '@/lib/utils'
import type { EventItem } from '#/utils/mocks'

interface EventCardProps {
  event: EventItem
}

export function EventCard({ event }: EventCardProps) {
  const soldOut = event.available <= 0

  return (
    <div className="group relative flex flex-col overflow-hidden bg-white border border-zinc-200 rounded-lg">
      <div className="aspect-video w-full overflow-hidden bg-zinc-100 group-hover:opacity-95 transition-opacity relative">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover object-center"
        />
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
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-2xs font-medium text-zinc-600 capitalize">
            {event.type === 'show' ? 'Show' : 'Cinema'}
          </span>
          <span className="text-xs text-zinc-500">
            {event.available > 0
              ? `${event.available} disponíveis`
              : 'Esgotado'}
          </span>
        </div>

        <h3 className="text-base font-medium text-zinc-950 line-clamp-1 mb-2">
          {event.title}
        </h3>

        <p className="text-xs text-zinc-500 line-clamp-2 flex-grow mb-4">
          {event.description}
        </p>

        <div className="border-t border-zinc-100 pt-4 mt-auto flex items-center justify-between">
          <div className="text-xs text-zinc-500 space-y-0.5">
            <div>{formatDateTime(event.date, event.time)}</div>
            <div className="line-clamp-1">{event.location}</div>
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
