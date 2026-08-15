import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CatchNotFound } from '@tanstack/react-router'
import { useEventById } from '../presentation/hooks/useEvents'
import { usePurchaseTicket } from '../presentation/hooks/useTickets'
import { mapEventDetailToEventItem } from '../presentation/mappers/viewMappers'
import { PageContainer } from '../components/PageContainer'
import { BackLink } from '../components/BackLink'
import { NotFoundState } from '../components/ErrorState'
import { CapacityIndicator } from '../components/CapacityIndicator'
import { QuantitySelector } from '../components/QuantitySelector'
import { FormInput } from '../components/FormField'
import { AlertBox } from '../components/AlertBox'
import { LoadingState } from '../components/LoadingState'
import { formatDateTime, formatPrice } from '@/lib/utils'

export const Route = createFileRoute('/events/$id')({
  component: EventDetails,
  pendingComponent: () => (
    <PageContainer className="py-16">
      <LoadingState message="Carregando evento..." />
    </PageContainer>
  ),
  errorComponent: ({ error, reset }) => (
    <CatchNotFound
      fallback={() =>
        <NotFoundState
          title="Evento não encontrado"
          error={error}
          backLabel="Voltar para a página inicial"
        />
      }
    >
      <PageContainer className="py-16">
        <LoadingState message="Erro ao carregar..." />
        <button
          onClick={reset}
          className="mt-4 text-sm text-zinc-600 hover:text-zinc-900 underline"
        >
          Tentar novamente
        </button>
      </PageContainer>
    </CatchNotFound>
  ),
})

function EventDetails() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: eventDetail } = useEventById(id)

  const event = mapEventDetailToEventItem(eventDetail)

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

  if (!event) {
    return (
      <NotFoundState
        title="Evento não encontrado"
        backLabel="Voltar para a página inicial"
      />
    )
  }

  const unitPrice = event.price
  const total = unitPrice * qty
  const isSubmitting = purchaseMutation.isPending

  return (
    <PageContainer maxWidth="5xl">
      <BackLink to="/" label="Voltar para Eventos" />

      <div className="overflow-hidden bg-white border border-zinc-200 rounded-lg">
        <div className="aspect-[21/9] w-full bg-zinc-100">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 capitalize">
              {event.type === 'show' ? 'Show' : 'Cinema'}
            </span>
            {event.available === 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Esgotado
              </span>
            )}
          </div>

          <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl mb-4">
            {event.title}
          </h1>

          <div className="grid gap-8 md:grid-cols-3 md:border-t md:border-zinc-100 md:pt-8">
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
                    <p className="font-medium text-zinc-900">
                      {formatDateTime(event.date, event.time)}
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
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-zinc-900">{event.location}</p>
                    {event.address && (
                      <p className="text-zinc-500 mt-0.5">{event.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {event.capacity > 0 && (
                <CapacityIndicator
                  available={event.available}
                  capacity={event.capacity}
                />
              )}
            </div>

            <div className="md:col-span-1">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Preço por ingresso
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-zinc-950">
                    {formatPrice(unitPrice)}
                  </p>
                </div>

                <form onSubmit={handlePurchase} className="space-y-4">
                  <QuantitySelector
                    value={qty}
                    onChange={setQty}
                    min={1}
                    max={Math.max(1, event.available || 1)}
                    disabled={event.available === 0}
                  />

                  <FormInput
                    label="Nome Completo"
                    id="buyerName"
                    type="text"
                    required
                    disabled={isSubmitting || event.available === 0}
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Quem vai utilizar?"
                  />

                  <FormInput
                    label="E-mail"
                    id="buyerEmail"
                    type="email"
                    required
                    disabled={isSubmitting || event.available === 0}
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                  />

                  <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                    <span className="text-sm text-zinc-600">Total</span>
                    <span className="text-lg font-semibold text-zinc-950">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || event.available === 0 || !buyerName || !buyerEmail
                    }
                    className="w-full rounded bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {event.available === 0
                      ? 'Ingressos esgotados'
                      : isSubmitting
                        ? 'Processando...'
                        : `Reservar ${qty} ingresso${qty > 1 ? 's' : ''}`}
                  </button>
                </form>

                {purchaseMutation.isError && (
                  <AlertBox
                    title="Erro ao comprar"
                    error={purchaseMutation.error}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
