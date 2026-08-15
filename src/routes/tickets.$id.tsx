import { createFileRoute } from '@tanstack/react-router'
import { CatchNotFound } from '@tanstack/react-router'
import { useTicketById } from '../presentation/hooks/useTickets'
import { TicketCard } from '../components/TicketCard'
import { PageContainer } from '../components/PageContainer'
import { BackLink } from '../components/BackLink'
import { NotFoundState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'

export const Route = createFileRoute('/tickets/$id')({
  component: TicketView,
  pendingComponent: () => (
    <PageContainer maxWidth="md" className="py-16">
      <LoadingState message="Carregando ingresso..." />
    </PageContainer>
  ),
  errorComponent: ({ error }) => (
    <CatchNotFound
      fallback={() => <NotFoundState title="Ingresso não encontrado" error={error} />}
    >
      <NotFoundState title="Erro ao carregar ingresso" error={error} />
    </CatchNotFound>
  ),
})

function TicketView() {
  const { id } = Route.useParams()
  const { data: ticket } = useTicketById(id)

  if (!ticket) {
    return <NotFoundState title="Ingresso não encontrado" />
  }

  return (
    <PageContainer maxWidth="md">
      <BackLink to="/" label="Voltar para Eventos" />
      <TicketCard ticket={ticket} showShareLink />
    </PageContainer>
  )
}
