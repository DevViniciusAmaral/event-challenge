import { createFileRoute, Link } from '@tanstack/react-router'
import { useTicketById } from '../presentation/hooks/useTickets'
import { TicketCard } from '../components/TicketCard'

export const Route = createFileRoute('/tickets/$id')({
  component: TicketView,
})

function TicketView() {
  const { id } = Route.useParams()
  const { data: ticket, isLoading, isError, error } = useTicketById(id)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="animate-pulse text-sm text-zinc-400">
          Carregando ingresso...
        </div>
      </div>
    )
  }

  if (!ticket || isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-medium text-zinc-900">
          Ingresso não encontrado
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          {error instanceof Error
            ? error.message
            : 'O ingresso solicitado pode ter sido removido ou não existe.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center text-sm font-medium text-zinc-900 underline underline-offset-4"
        >
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
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

      <TicketCard ticket={ticket} showShareLink />
    </div>
  )
}
