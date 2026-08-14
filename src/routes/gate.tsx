import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useValidateTicket } from '../presentation/hooks/useTickets'
import { useOrganizerEvents } from '../presentation/hooks/useOrganizer'

export const Route = createFileRoute('/gate')({
  component: GateValidation,
})

type ValidationStatus = 'idle' | 'valid' | 'invalid' | 'used'

function GateValidation() {
  const { data: eventsData, isLoading: loadingEvents } = useOrganizerEvents()
  const events = eventsData?.data ?? []

  const [selectedEventId, setSelectedEventId] = useState('')
  const [ticketCode, setTicketCode] = useState('')

  const validateMutation = useValidateTicket({
    onError: () => {
      setValidationResult({
        status: 'invalid',
        message: 'Erro ao validar ingresso. Tente novamente.',
      })
    },
  })

  const [validationResult, setValidationResult] = useState<{
    status: ValidationStatus
    ticket?: {
      id: string
      code: string
      buyerName: string
      event: { id: string; title: string }
    }
    message?: string
  }>({ status: 'idle' })

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketCode.trim()) return

    validateMutation.mutate(ticketCode.trim(), {
      onSuccess: (data) => {
        if (data.valid && data.ticket) {
          setValidationResult({
            status: 'valid',
            ticket: data.ticket,
            message: 'Acesso liberado. Ingresso verificado com sucesso.',
          })
        } else {
          setValidationResult({
            status: 'used',
            message: data.message || 'Ingresso já utilizado ou inválido.',
          })
        }
      },
    })
  }

  const handleCheckIn = () => {
    if (validationResult.status === 'valid') {
      setValidationResult((prev) => ({
        ...prev,
        status: 'used',
        message: 'Check-in registrado (simulação local).',
      }))
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-200 pb-8 mb-10 text-center">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
          Portaria & Validação
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Controle de acesso e check-in de ingressos em tempo real.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
        {/* Form */}
        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <label
              htmlFor="event-select"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Selecione o Evento
            </label>
            {loadingEvents ? (
              <div className="w-full h-9 animate-pulse bg-zinc-100 rounded-md" />
            ) : (
              <select
                id="event-select"
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value)
                  setValidationResult({ status: 'idle' })
                }}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                {events.length === 0 && (
                  <option value="">Nenhum evento encontrado</option>
                )}
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} (
                    {evt.date
                      ? new Date(evt.date).toLocaleDateString('pt-BR')
                      : ''}
                    )
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label
              htmlFor="ticket-code"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Código do Ingresso (ex: EVT-8F3K92)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="ticket-code"
                required
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="Insira o código do ingresso..."
                disabled={validateMutation.isPending}
                className="flex-grow rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono disabled:bg-zinc-100"
              />
              <button
                type="submit"
                disabled={validateMutation.isPending}
                className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
              >
                {validateMutation.isPending ? '...' : 'Validar'}
              </button>
            </div>
          </div>
        </form>

        {/* Validation Result Box */}
        {validationResult.status !== 'idle' && (
          <div className="border-t border-zinc-100 pt-6">
            {/* Status: VALID */}
            {validationResult.status === 'valid' && validationResult.ticket && (
              <div className="space-y-4">
                <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-4 text-center">
                  <div className="flex justify-center text-emerald-600 mb-1">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-emerald-800">
                    Ingresso Válido
                  </h3>
                  <p className="text-xs text-emerald-600 mt-1">
                    {validationResult.message}
                  </p>
                </div>

                <div className="border border-zinc-200 rounded-md p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Comprador</span>
                    <span className="font-medium text-zinc-900">
                      {validationResult.ticket.buyerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Evento</span>
                    <span className="font-medium text-zinc-900">
                      {validationResult.ticket.event.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Código</span>
                    <span className="font-medium text-zinc-900 font-mono">
                      {validationResult.ticket.code}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="w-full rounded bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Registrar Entrada (Check-In)
                </button>
              </div>
            )}

            {/* Status: USED */}
            {validationResult.status === 'used' && (
              <div className="space-y-4">
                <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4 text-center">
                  <div className="flex justify-center text-amber-600 mb-1">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-amber-800">
                    Ingresso Já Utilizado / Inválido
                  </h3>
                  <p className="text-xs text-amber-600 mt-1">
                    {validationResult.message}
                  </p>
                </div>

                {validationResult.ticket && (
                  <div className="border border-zinc-200 rounded-md p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Comprador</span>
                      <span className="font-medium text-zinc-900">
                        {validationResult.ticket.buyerName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Evento</span>
                      <span className="font-medium text-zinc-900">
                        {validationResult.ticket.event.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status: INVALID */}
            {validationResult.status === 'invalid' && (
              <div className="rounded-md border border-red-200 bg-red-50/50 p-4 text-center">
                <div className="flex justify-center text-red-600 mb-1">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-red-800">
                  Ingresso Inválido
                </h3>
                <p className="text-xs text-red-600 mt-1">
                  {validationResult.message}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
