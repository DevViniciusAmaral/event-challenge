import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useOrganizerEvents,
  useOrganizerStats,
} from '../hooks/useOrganizer'
import {
  mapOrganizerEventToEventItem,
  mapStats,
} from '../utils/viewMappers'
import { Button } from '@/components/ui/button'
import { Film, PlusCircle, Trash2 } from 'lucide-react'
import { CreateEventModal } from '../components/CreateEventModal'
import { useDeleteEvent } from '../hooks/useEvents'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PageContainer } from '../components/PageContainer'
import { PageHeader } from '../components/PageHeader'
import { MetricCard } from '../components/MetricCard'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/organizer')({
  component: OrganizerDashboard,
  pendingComponent: () => (
    <PageContainer>
      <PageHeader
        title="Área do Organizador"
        description="Gerencie seus eventos e acompanhe as vendas de ingressos."
        withDivider
      >
        <Button
          disabled
          className="bg-zinc-900 text-white px-4 py-2.5 h-auto rounded-md opacity-60"
        >
          <PlusCircle className="h-4 w-4" />
          Criar Novo Evento
        </Button>
      </PageHeader>
      <div className="grid gap-6 sm:grid-cols-3 mb-10">
        <MetricCard label="Total de Eventos" value={0} isLoading />
        <MetricCard label="Ingressos Vendidos" value={0} isLoading />
        <MetricCard label="Receita Total" value="R$ 0.00" isLoading />
      </div>
      <LoadingState message="Carregando eventos..." className="py-12" />
    </PageContainer>
  ),
  errorComponent: ({ error, reset }) => (
    <PageContainer>
      <PageHeader
        title="Área do Organizador"
        description="Gerencie seus eventos e acompanhe as vendas de ingressos."
        withDivider
      />
      <ErrorState
        title="Erro ao carregar painel"
        error={error}
        onRetry={reset}
      />
    </PageContainer>
  ),
})

function OrganizerDashboard() {
  const [createOpen, setCreateOpen] = useState(false)
  const deleteMutation = useDeleteEvent()
  const { data: stats } = useOrganizerStats()
  const { data: eventsData } = useOrganizerEvents()

  const events = eventsData.map(mapOrganizerEventToEventItem)
  const statsMapped = mapStats(stats)

  const {
    totalEvents,
    totalTicketsSold,
    totalRevenue,
    publishedEvents,
    upcomingEvents,
  } = statsMapped
  const averageRevenue =
    totalEvents > 0 ? totalRevenue / Math.max(totalEvents, 1) : 0

  const listSoldSum = events.reduce((sum, evt) => {
    const cap = Number(evt.capacity) || 0
    const av = Number(evt.availableTickets) || 0
    return sum + Math.max(0, cap - av)
  }, 0)
  const listRevenueSum = events.reduce((sum, evt) => {
    const cap = Number(evt.capacity) || 0
    const av = Number(evt.availableTickets) || 0
    const price = Number(evt.price) || 0
    return sum + Math.max(0, cap - av) * price
  }, 0)

  const soldByEvent = new Map<string, number>()
  const revenueByEvent = new Map<string, number>()

  events.forEach((evt) => {
    const cap = Number(evt.capacity) || 0
    const av = Number(evt.availableTickets) || 0
    const price = Number(evt.price) || 0
    let sold = Math.max(0, cap - av)
    let revenue = sold * price

    if (listSoldSum === 0 && totalTicketsSold > 0 && events.length > 0) {
      sold = Math.round(totalTicketsSold / events.length)
      revenue =
        price > 0
          ? Math.round(sold * price)
          : Math.round(totalRevenue / events.length)
    } else if (listRevenueSum === 0 && totalRevenue > 0 && price > 0) {
      sold =
        sold || Math.max(1, Math.round(totalRevenue / price / events.length))
      revenue = sold * price
    }

    soldByEvent.set(evt.id, sold)
    revenueByEvent.set(evt.id, revenue)
  })

  return (
    <PageContainer>
      <PageHeader
        title="Área do Organizador"
        description="Gerencie seus eventos e acompanhe as vendas de ingressos."
        withDivider
      >
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 h-auto rounded-md"
        >
          <PlusCircle className="h-4 w-4" />
          Criar Novo Evento
        </Button>
      </PageHeader>

      <div className="grid gap-6 sm:grid-cols-3 mb-10">
        <MetricCard label="Total de Eventos" value={totalEvents} />
        <MetricCard label="Ingressos Vendidos" value={totalTicketsSold} />
        <MetricCard
          label="Receita Total"
          value={`R$ ${totalRevenue.toFixed(2)}`}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-medium text-zinc-950">
            Seus Eventos Publicados
          </h2>

          {events.length > 0 ? (
            <div className="overflow-hidden border border-zinc-200 rounded-md bg-white">
              <ul className="divide-y divide-zinc-200">
                {events.map((evt) => {
                  const capacity = Number(evt.capacity) || 0
                  const soldCount = soldByEvent.get(evt.id) ?? 0
                  const revenue = revenueByEvent.get(evt.id) ?? 0
                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables === evt.id
                  return (
                    <li
                      key={evt.id}
                      className="p-6 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-4 min-w-0 flex-1">
                          <Link
                            to="/events/$id"
                            params={{ id: evt.id }}
                            className="shrink-0 h-12 w-12 rounded bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center hover:ring-2 hover:ring-zinc-900/30 transition"
                          >
                            <Film className="h-5 w-5 text-white/80" strokeWidth={2} />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              to="/events/$id"
                              params={{ id: evt.id }}
                              className="text-sm font-medium text-zinc-950 hover:text-zinc-700 hover:underline truncate block"
                            >
                              {evt.movie.name}
                            </Link>
                            <div className="flex gap-3 mt-1 text-xs text-zinc-500 flex-wrap">
                              <span>{formatDate(evt.date)}</span>
                              <span>&bull;</span>
                              <span className="truncate">{evt.local}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-medium text-zinc-900">
                              {soldCount} / {capacity} vendidos
                            </p>
                            <p className="text-2xs text-zinc-400 mt-0.5">
                              Receita: R$ {revenue.toFixed(2)}
                            </p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                disabled={isDeleting}
                                aria-label={`Excluir evento ${evt.movie.name}`}
                              >
                                {isDeleting ? (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Excluir este evento?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir{' '}
                                  <strong className="text-zinc-900">
                                    "{evt.movie.name}"
                                  </strong>
                                  ? Esta ação é permanente e não poderá ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button
                                    variant="outline"
                                    disabled={isDeleting}
                                  >
                                    Cancelar
                                  </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      deleteMutation.mutate(evt.id)
                                    }
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                  >
                                    {isDeleting
                                      ? 'Excluindo...'
                                      : 'Sim, excluir permanentemente'}
                                  </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <EmptyState
              message="Você ainda não publicou nenhum evento."
              className="py-12"
            />
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium text-zinc-950">Métricas</h2>

          <div className="border border-zinc-200 rounded-md bg-white p-6 space-y-4">
            <ul className="divide-y divide-zinc-100 space-y-4">
              <SidebarMetric
                label="Eventos Publicados"
                value={publishedEvents}
                first
              />
              <SidebarMetric label="Próximos Eventos" value={upcomingEvents} />
              <SidebarMetric
                label="Receita Média / Evento"
                value={`R$ ${averageRevenue.toFixed(2)}`}
                last
              />
            </ul>
          </div>
        </div>
      </div>
      <CreateEventModal open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  )
}

interface SidebarMetricProps {
  label: string
  value: number | string
  first?: boolean
  last?: boolean
}

function SidebarMetric({ label, value, first, last }: SidebarMetricProps) {
  return (
    <li
      className={`pt-0 ${first ? 'first:pt-0 pb-4' : last ? 'pb-0 pt-4' : 'pt-4 pb-4'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-zinc-500">{label}</p>
        </div>
        <p className="text-sm font-semibold text-zinc-900">{value}</p>
      </div>
    </li>
  )
}
