import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useValidateTicket } from '../hooks/useTickets'
import { useOrganizerEvents } from '../hooks/useOrganizer'
import { PageContainer } from '../components/PageContainer'
import { PageHeader } from '../components/PageHeader'
import { FormInput, FormSelect } from '../components/FormField'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/gate')({
  component: GateValidation,
  pendingComponent: () => (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="Portaria & Validação"
        description="Controle de acesso e check-in de ingressos em tempo real."
        withDivider
        align="center"
      />
      <LoadingState message="Carregando lista de eventos..." className="py-12" />
    </PageContainer>
  ),
  errorComponent: ({ error, reset }) => (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="Portaria & Validação"
        description="Controle de acesso e check-in de ingressos em tempo real."
        withDivider
        align="center"
      />
      <ErrorState
        title="Erro ao carregar portaria"
        error={error}
        onRetry={reset}
      />
    </PageContainer>
  ),
})

type ValidationStatus = 'idle' | 'valid' | 'invalid' | 'used'

function GateValidation() {
  const { data: eventsData } = useOrganizerEvents()
  const events = eventsData.data

  const [selectedEventId, setSelectedEventId] = useState('')
  const [ticketCode, setTicketCode] = useState('')

  const validateMutation = useValidateTicket()

  const [validationResult, setValidationResult] = useState<{
    status: ValidationStatus
    ticket?: {
      id: string
      code: string
      buyerName: string
      event: { id: string; movie: { name: string } }
    }
    message?: string
  }>({ status: 'idle' })

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketCode.trim()) return

    validateMutation.mutate(ticketCode.trim(), {
      onSuccess: (data: any) => {
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
    <PageContainer maxWidth="xl">
      <PageHeader
        title="Portaria & Validação"
        description="Controle de acesso e check-in de ingressos em tempo real."
        withDivider
        align="center"
      />

      <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <FormSelect
              label="Selecione o Evento"
              id="event-select"
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value)
                setValidationResult({ status: 'idle' })
              }}
            >
              {events.length === 0 ? (
                <option value="">Nenhum evento encontrado</option>
              ) : (
                events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.movie.name} ({formatDate(evt.date)})
                  </option>
                ))
              )}
            </FormSelect>
          </div>

          <div>
            <FormInput
              label="Código do Ingresso (ex: EVT-8F3K92)"
              id="ticket-code"
              type="text"
              required
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="Insira o código do ingresso..."
              disabled={validateMutation.isPending}
              className="font-mono"
            />
            <button
              type="submit"
              disabled={validateMutation.isPending}
              className="mt-2 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {validateMutation.isPending ? '...' : 'Validar'}
            </button>
          </div>
        </form>

        {validationResult.status !== 'idle' && (
          <div className="border-t border-zinc-100 pt-6">
            {validationResult.status === 'valid' && validationResult.ticket && (
              <div className="space-y-4">
                <ResultBanner
                  variant="success"
                  icon={
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
                  }
                  title="Ingresso Válido"
                  message={validationResult.message}
                />

                <TicketInfo ticket={validationResult.ticket} />

                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="w-full rounded bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Registrar Entrada (Check-In)
                </button>
              </div>
            )}

            {validationResult.status === 'used' && (
              <div className="space-y-4">
                <ResultBanner
                  variant="warning"
                  icon={
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
                  }
                  title="Ingresso Já Utilizado / Inválido"
                  message={validationResult.message}
                />

                {validationResult.ticket && (
                  <TicketInfo ticket={validationResult.ticket} />
                )}
              </div>
            )}

            {validationResult.status === 'invalid' && (
              <ResultBanner
                variant="error"
                icon={
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
                }
                title="Ingresso Inválido"
                message={validationResult.message}
              />
            )}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

type BannerVariant = 'success' | 'warning' | 'error'

const bannerStyles: Record<BannerVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50/50 text-emerald-600',
  warning: 'border-amber-200 bg-amber-50/50 text-amber-600',
  error: 'border-red-200 bg-red-50/50 text-red-600',
}

const bannerTextStyles: Record<BannerVariant, { title: string; body: string }> =
  {
    success: { title: 'text-emerald-800', body: 'text-emerald-600' },
    warning: { title: 'text-amber-800', body: 'text-amber-600' },
    error: { title: 'text-red-800', body: 'text-red-600' },
  }

interface ResultBannerProps {
  variant: BannerVariant
  icon: React.ReactNode
  title: string
  message?: string
}

function ResultBanner({ variant, icon, title, message }: ResultBannerProps) {
  return (
    <div
      className={`rounded-md border p-4 text-center ${bannerStyles[variant]}`}
    >
      <div className="flex justify-center mb-1">{icon}</div>
      <h3
        className={`text-sm font-semibold ${bannerTextStyles[variant].title}`}
      >
        {title}
      </h3>
      {message && (
        <p className={`text-xs mt-1 ${bannerTextStyles[variant].body}`}>
          {message}
        </p>
      )}
    </div>
  )
}

interface TicketInfoProps {
  ticket: {
    buyerName: string
    event: { movie: { name: string } }
    code?: string
  }
}

function TicketInfo({ ticket }: TicketInfoProps) {
  return (
    <div className="border border-zinc-200 rounded-md p-4 space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-zinc-500">Comprador</span>
        <span className="font-medium text-zinc-900">{ticket.buyerName}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-zinc-500">Evento</span>
        <span className="font-medium text-zinc-900">{ticket.event.movie.name}</span>
      </div>
      {ticket.code && (
        <div className="flex justify-between">
          <span className="text-zinc-500">Código</span>
          <span className="font-medium text-zinc-900 font-mono">
            {ticket.code}
          </span>
        </div>
      )}
    </div>
  )
}
