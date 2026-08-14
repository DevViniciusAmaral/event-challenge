import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useEventById } from '../presentation/hooks/useEvents'
import { usePurchaseTicket } from '../presentation/hooks/useTickets'
import { mapEventDetailToEventItem } from '../presentation/mappers/viewMappers'

export const Route = createFileRoute('/events/$id')({
  component: EventDetails,
})

function EventDetails() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: eventDetail, isLoading, isError, error } = useEventById(id)

  const event = eventDetail ? mapEventDetailToEventItem(eventDetail) : null

  const [qty, setQty] = useState(1)
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')

  const purchaseMutation = usePurchaseTicket(id, {
    onSuccess: (data) => {
      navigate({ to: '/tickets/$id', params: { id: data.id } })
    },
  })

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault()
    if (!buyerName || !buyerEmail) return
    purchaseMutation.mutate({
      buyerName,
      buyerEmail,
      quantity: qty,
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="animate-pulse text-sm text-zinc-400">
          Carregando evento...
        </div>
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-medium text-zinc-900">Evento não encontrado</h2>
        <p className="mt-2 text-sm text-zinc-500">
          {error instanceof Error ? error.message : 'O evento solicitado pode ter sido removido ou não existe.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
        >
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const capacityPercentage = Math.round(
    ((event.capacity - event.available) / event.capacity) * 100,
  )

  const unitPrice = event.price
  const total = unitPrice * qty
  const isSubmitting = purchaseMutation.isPending

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <svg
          className="mr-1.5 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para Eventos
      </Link>

      <div className="overflow-hidden bg-white border border-zinc-200 rounded-lg">
        {/* Banner image */}
        <div className="aspect-[21/9] w-full bg-zinc-100">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 capitalize">
              {event.type === 'show' ? 'Show' : 'Cinema'}
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl mb-4">
            {event.title}
          </h1>

          <div className="grid gap-8 md:grid-cols-3 md:border-t md:border-zinc-100 md:pt-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Sobre o evento
                </h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="space-y-4 text-sm text-zinc-600">
                <div className="flex items-start">
                  <svg
                    className="mr-3 h-5 w-5 text-zinc-400 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-zinc-900">Data e Horário</p>
                    <p>
                      {event.date
                        ? new Date(event.date).toLocaleDateString('pt-BR')
                        : ''}{' '}
                      às {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="mr-3 h-5 w-5 text-zinc-400 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-zinc-900">{event.location}</p>
                    <p className="text-zinc-500">{event.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket purchase card */}
            <form
              onSubmit={handlePurchase}
              className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 flex flex-col justify-between h-fit space-y-5"
            >
              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Ingresso
                </h3>
                <div className="mt-2 text-2xl font-bold text-zinc-950">
                  {event.price === 0
                    ? 'Gratuito'
                    : `R$ ${event.price.toFixed(2)}`}
                </div>
              </div>

              {/* Capacity indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Disponibilidade</span>
                  <span className="font-medium text-zinc-900">
                    {event.available} / {event.capacity} restantes
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 transition-all"
                    style={{ width: `${100 - capacityPercentage}%` }}
                  />
                </div>
              </div>

              {event.available > 0 ? (
                <>
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="detail-buyer-name"
                        className="block text-xs font-medium text-zinc-500 mb-1"
                      >
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="detail-buyer-name"
                        required
                        disabled={isSubmitting}
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="detail-buyer-email"
                        className="block text-xs font-medium text-zinc-500 mb-1"
                      >
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="detail-buyer-email"
                        required
                        disabled={isSubmitting}
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="voce@exemplo.com"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">
                        Quantidade
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="h-9 w-9 flex items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-medium text-zinc-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() =>
                            setQty(Math.min(event.available || 1, qty + 1))
                          }
                          className="h-9 w-9 flex items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                      <span className="text-xs font-medium text-zinc-500">
                        Total
                      </span>
                      <span className="text-base font-semibold text-zinc-950">
                        {total === 0
                          ? 'Gratuito'
                          : `R$ ${total.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="block w-full text-center rounded bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processando compra...' : 'Comprar ingresso'}
                  </button>

                  {purchaseMutation.isError && (
                    <div className="rounded-md border border-red-200 bg-red-50/50 p-3">
                      <p className="text-xs font-medium text-red-800">
                        Erro ao comprar
                      </p>
                      <p className="text-2xs text-red-600 mt-0.5">
                        {purchaseMutation.error instanceof Error
                          ? purchaseMutation.error.message
                          : 'Tente novamente.'}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <button
                  disabled
                  type="button"
                  className="w-full text-center rounded bg-zinc-200 py-3 text-sm font-medium text-zinc-400 cursor-not-allowed"
                >
                  Esgotado
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
