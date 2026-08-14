import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { usePublishedEvents } from '../presentation/hooks/useEvents'
import { mapEventSummaryToEventItem } from '../presentation/mappers/viewMappers'
import type { EventItem } from '../utils/mocks'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'show' | 'movie'>('all')

  const { data, isLoading, isError, error } = usePublishedEvents(
    search.trim() || undefined,
  )

  const events: EventItem[] =
    data?.data.map((summary) => mapEventSummaryToEventItem(summary)) || []

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.location.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' ? true : evt.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 border-b border-zinc-200 pb-10">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl">
          Descubra eventos locais, shows ao vivo e sessões de cinema.
        </h1>
        <p className="mt-3 text-base text-zinc-500">
          Encontre os melhores ingressos com simplicidade, transparência e
          controle total.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por evento ou local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {(['all', 'show', 'movie'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                typeFilter === type
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              {type === 'all' && 'Todos'}
              {type === 'show' && 'Shows'}
              {type === 'movie' && 'Cinema'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-lg border border-dashed border-zinc-300 py-16 text-center">
          <div className="animate-pulse text-sm text-zinc-400">
            Carregando eventos...
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50/50 py-16 text-center">
          <p className="text-sm font-medium text-red-800">
            Erro ao carregar eventos
          </p>
          <p className="mt-1 text-xs text-red-600">
            {error instanceof Error ? error.message : 'Tente novamente mais tarde.'}
          </p>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !isError && filteredEvents.length > 0 ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="group relative flex flex-col overflow-hidden bg-white border border-zinc-200 rounded-lg"
            >
              {/* Image Container */}
              <div className="aspect-video w-full overflow-hidden bg-zinc-100 group-hover:opacity-95 transition-opacity relative">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="h-full w-full object-cover object-center"
                />
                {evt.available <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      Esgotado
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-2xs font-medium text-zinc-600 capitalize">
                    {evt.type === 'show' ? 'Show' : 'Cinema'}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {evt.available > 0
                      ? `${evt.available} disponíveis`
                      : 'Esgotado'}
                  </span>
                </div>

                <h3 className="text-base font-medium text-zinc-950 line-clamp-1 mb-2">
                  {evt.title}
                </h3>

                <p className="text-xs text-zinc-500 line-clamp-2 flex-grow mb-4">
                  {evt.description}
                </p>

                {/* Details list */}
                <div className="border-t border-zinc-100 pt-4 mt-auto flex items-center justify-between">
                  <div className="text-xs text-zinc-500 space-y-0.5">
                    <div>
                      {evt.date
                        ? new Date(evt.date).toLocaleDateString('pt-BR')
                        : ''}{' '}
                      às {evt.time}
                    </div>
                    <div className="line-clamp-1">{evt.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-zinc-900">
                      {evt.price === 0
                        ? 'Gratuito'
                        : `R$ ${evt.price.toFixed(2)}`}
                    </div>
                  </div>
                </div>

                <Link
                  to="/events/$id"
                  params={{ id: evt.id }}
                  className={`mt-4 block w-full rounded py-2 text-center text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    evt.available > 0
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900'
                      : 'bg-zinc-200 text-zinc-500 hover:bg-zinc-300 focus:ring-zinc-400 cursor-not-allowed'
                  }`}
                >
                  {evt.available > 0 ? 'Visualizar Evento' : 'Indisponível'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && filteredEvents.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 py-16 text-center">
          <p className="text-sm text-zinc-500">
            Nenhum evento encontrado para os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  )
}
