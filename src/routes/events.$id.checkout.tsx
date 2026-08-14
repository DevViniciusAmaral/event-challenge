import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useEventById } from '../presentation/hooks/useEvents'
import { usePurchaseTicket } from '../presentation/hooks/useTickets'
import { mapEventDetailToEventItem } from '../presentation/mappers/viewMappers'

export const Route = createFileRoute('/events/$id/checkout')({
  component: Checkout,
})

function Checkout() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: eventDetail, isLoading: loadingEvent, isError: eventError } =
    useEventById(id)

  const event = eventDetail ? mapEventDetailToEventItem(eventDetail) : null

  const purchaseMutation = usePurchaseTicket(id, {
    onSuccess: (data) => {
      navigate({ to: '/tickets/$id', params: { id: data.id } })
    },
  })

  const [qty, setQty] = useState(1)
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerCpf, setBuyerCpf] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')

  if (loadingEvent) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="animate-pulse text-sm text-zinc-400">Carregando...</div>
      </div>
    )
  }

  if (!event || eventError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-medium text-zinc-900">Evento não encontrado</h2>
        <Link
          to="/"
          className="mt-6 inline-flex items-center text-sm font-medium text-zinc-900 underline underline-offset-4"
        >
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const unitPrice = event.price
  const total = unitPrice * qty

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!buyerName || !buyerEmail || !buyerCpf) return

    purchaseMutation.mutate({
      buyerName,
      buyerEmail,
      quantity: qty,
    })
  }

  const isSubmitting = purchaseMutation.isPending

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/events/$id"
        params={{ id: event.id }}
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
        Voltar para Detalhes
      </Link>

      <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl mb-8">
        Finalizar Compra
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
            <h2 className="text-base font-medium text-zinc-900">
              Informações de Contato
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-zinc-500 mb-1.5"
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
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
                  htmlFor="email"
                  className="block text-xs font-medium text-zinc-500 mb-1.5"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  disabled={isSubmitting}
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="cpf"
                  className="block text-xs font-medium text-zinc-500 mb-1.5"
                >
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  required
                  disabled={isSubmitting}
                  value={buyerCpf}
                  onChange={(e) => setBuyerCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
            <h2 className="text-base font-medium text-zinc-900">
              Forma de Pagamento (Simulado)
            </h2>

            <div className="flex gap-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setPaymentMethod('pix')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md border py-3 text-sm font-medium transition-colors ${paymentMethod === 'pix'
                    ? 'border-zinc-900 bg-zinc-50 text-zinc-900'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                  } disabled:opacity-50`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                Pix
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md border py-3 text-sm font-medium transition-colors ${paymentMethod === 'card'
                    ? 'border-zinc-900 bg-zinc-50 text-zinc-900'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                  } disabled:opacity-50`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Cartão de Crédito
              </button>
            </div>

            {paymentMethod === 'pix' ? (
              <div className="text-center py-4 bg-zinc-50 rounded-md border border-zinc-150">
                <p className="text-xs text-zinc-500">
                  Um código Pix Copie e Cole será gerado após finalizar a compra
                  para simular o pagamento.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="card-number"
                    className="block text-xs font-medium text-zinc-500 mb-1.5"
                  >
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    id="card-number"
                    disabled
                    placeholder="•••• •••• •••• •••• (Simulação estática)"
                    className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="card-name"
                    className="block text-xs font-medium text-zinc-500 mb-1.5"
                  >
                    Nome Impresso
                  </label>
                  <input
                    type="text"
                    id="card-name"
                    disabled
                    placeholder="NOME IMPRESSO"
                    className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-cvv"
                    className="block text-xs font-medium text-zinc-500 mb-1.5"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="card-cvv"
                    disabled
                    placeholder="•••"
                    className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {purchaseMutation.isError && (
              <div className="rounded-md border border-red-200 bg-red-50/50 p-4">
                <p className="text-xs font-medium text-red-800">
                  Erro ao realizar compra
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {purchaseMutation.error instanceof Error
                    ? purchaseMutation.error.message
                    : 'Tente novamente.'}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processando...' : 'Finalizar e Gerar Ingresso'}
          </button>
        </form>

        <div className="bg-white border border-zinc-200 rounded-lg p-6 h-fit space-y-6">
          <h2 className="text-base font-medium text-zinc-900 border-b border-zinc-100 pb-3">
            Resumo do Pedido
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={event.image}
                alt={event.title}
                className="h-16 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xs font-medium text-zinc-900 line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-2xs text-zinc-400 mt-0.5">{event.location}</p>
                <p className="text-2xs text-zinc-400">
                  {event.date
                    ? new Date(event.date).toLocaleDateString('pt-BR')
                    : ''}{' '}
                  às {event.time}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Quantidade</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-7 w-7 flex items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-medium">{qty}</span>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setQty(Math.min(event.available, qty + 1))
                    }
                    className="h-7 w-7 flex items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">Preço unitário</span>
                <span className="text-zinc-900 font-medium">
                  {unitPrice === 0 ? 'Gratuito' : `R$ ${unitPrice.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between font-semibold text-zinc-950">
                <span>Total</span>
                <span>
                  {total === 0 ? 'Gratuito' : `R$ ${total.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
