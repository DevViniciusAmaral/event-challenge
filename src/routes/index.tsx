import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { usePublishedEvents } from '../presentation/hooks/useEvents'
import { mapEventSummaryToEventItem } from '../presentation/mappers/viewMappers'
import { PageContainer } from '../components/PageContainer'
import { PageHeader } from '../components/PageHeader'
import { SearchFilter } from '../components/SearchFilter'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'
import { EventCard } from '../components/EventCard'

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: () => (
    <PageContainer>
      <PageHeader
        title="Descubra eventos locais, shows ao vivo e sessões de cinema."
        description="Encontre os melhores ingressos com simplicidade, transparência e controle total."
        withDivider
      />
      <LoadingState message="Carregando eventos..." />
    </PageContainer>
  ),
  errorComponent: ({ error }) => (
    <PageContainer>
      <PageHeader
        title="Descubra eventos locais, shows ao vivo e sessões de cinema."
        description="Encontre os melhores ingressos com simplicidade, transparência e controle total."
        withDivider
      />
      <ErrorState title="Erro ao carregar eventos" error={error} />
    </PageContainer>
  ),
})

function Home() {
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim()

  const { data } = usePublishedEvents(normalizedSearch || undefined)

  const events = data.data.map((summary) =>
    mapEventSummaryToEventItem(summary),
  )

  const hasSearch = normalizedSearch.length > 0

  return (
    <PageContainer>
      <PageHeader
        title="Descubra eventos locais, shows ao vivo e sessões de cinema."
        description="Encontre os melhores ingressos com simplicidade, transparência e controle total."
        withDivider
      />

      <SearchFilter search={search} onSearchChange={setSearch} />

      {events.length > 0 ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <EmptyState
          message={
            hasSearch
              ? 'Nenhum evento encontrado para a busca realizada.'
              : 'Não existem eventos disponíveis no momento.'
          }
        />
      )}
    </PageContainer>
  )
}
