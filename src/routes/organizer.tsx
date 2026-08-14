import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useOrganizerEvents, useOrganizerStats } from '../presentation/hooks/useOrganizer'
import { mapOrganizerEventToEventItem } from '../presentation/mappers/viewMappers'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2 } from 'lucide-react'
import { CreateEventModal } from '../components/CreateEventModal'
import { useDeleteEvent } from '../presentation/hooks/useEvents'
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

export const Route = createFileRoute('/organizer')({
  component: OrganizerDashboard,
})

function OrganizerDashboard() {
  const [createOpen, setCreateOpen] = useState(false)
  const deleteMutation = useDeleteEvent()
  const { data: stats, isLoading: loadingStats } = useOrganizerStats()
  const { data: eventsData, isLoading: loadingEvents } = useOrganizerEvents()

  const events = eventsData?.data.map(mapOrganizerEventToEventItem) || []

  const totalEvents = Number(stats?.totalEvents) || 0
  const totalTicketsSold = Number(stats?.totalTicketsSold) || 0
  const totalRevenue = Number(stats?.totalRevenue) || 0
  const publishedEvents = Number(stats?.publishedEvents) || 0
  const upcomingEvents = Number(stats?.upcomingEvents) || 0
  const averageRevenue =
    totalEvents > 0 ? totalRevenue / Math.max(totalEvents, 1) : 0

  const listSoldSum = events.reduce((sum, evt) => {
    const cap = Number(evt.capacity) || 0
    const av = Number(evt.available) || 0
    return sum + Math.max(0, cap - av)
  }, 0)
  const listRevenueSum = events.reduce((sum, evt) => {
    const cap = Number(evt.capacity) || 0
    const av = Number(evt.available) || 0
    const price = Number(evt.price) || 0
    return sum + Math.max(0, cap - av) * price
  }, 0)

  const soldByEvent = new Map<string, number>()
  const revenueByEvent = new Map<string, number>()

  events.forEach((evt) => {
    const cap = Number(evt.capacity) || 0
    const av = Number(evt.available) || 0
    const price = Number(evt.price) || 0
    let sold = Math.max(0, cap - av)
    let revenue = sold * price

    if (listSoldSum === 0 && totalTicketsSold > 0 && events.length > 0) {
      sold = Math.round(totalTicketsSold / events.length)
      revenue = price > 0 ? Math.round(sold * price) : Math.round(totalRevenue / events.length)
    } else if (listRevenueSum === 0 && totalRevenue > 0 && price > 0) {
      sold = sold || Math.max(1, Math.round(totalRevenue / price / events.length))
      revenue = sold * price
    }

    soldByEvent.set(evt.id, sold)
    revenueByEvent.set(evt.id, revenue)
  })


  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-8 mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-zinc-900">
            Área do Organizador
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie seus eventos e acompanhe as vendas de ingressos.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 h-auto rounded-md"
        >
          <PlusCircle className="h-4 w-4" />
          Criar Novo Evento
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-3 mb-10">
        <div className="bg-white border border-zinc-200 rounded-md p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total de Eventos
          </p>
          <p className="mt-2 text-3xl font-light text-zinc-900">
            {loadingStats ? (
              <span className="animate-pulse text-zinc-300">—</span>
            ) : (
              totalEvents
            )}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-md p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Ingressos Vendidos
          </p>
          <p className="mt-2 text-3xl font-light text-zinc-900">
            {loadingStats ? (
              <span className="animate-pulse text-zinc-300">—</span>
            ) : (
              totalTicketsSold
            )}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-md p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Receita Total
          </p>
          <p className="mt-2 text-3xl font-light text-zinc-900">
            {loadingStats ? (
              <span className="animate-pulse text-zinc-300">—</span>
            ) : (
              `R$ ${totalRevenue.toFixed(2)}`
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Events Table List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-medium text-zinc-950">
            Seus Eventos Publicados
          </h2>

          {loadingEvents ? (
            <div className="rounded-md border border-dashed border-zinc-300 py-12 text-center">
              <div className="animate-pulse text-sm text-zinc-400">
                Carregando eventos...
              </div>
            </div>
          ) : events.length > 0 ? (
            <div className="overflow-hidden border border-zinc-200 rounded-md bg-white">
              <ul className="divide-y divide-zinc-200">
                {events.map((evt) => {
                  const capacity = Number(evt.capacity) || 0
                  const soldCount = soldByEvent.get(evt.id) ?? 0
                  const revenue = revenueByEvent.get(evt.id) ?? 0
                  const isDeleting = deleteMutation.isPending && deleteMutation.variables === evt.id
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
                            className="shrink-0"
                          >
                            <img
                              src={evt.image}
                              alt={evt.title}
                              className="h-12 w-12 rounded object-cover hover:ring-2 hover:ring-zinc-900/30 transition"
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              to="/events/$id"
                              params={{ id: evt.id }}
                              className="text-sm font-medium text-zinc-950 hover:text-zinc-700 hover:underline truncate block"
                            >
                              {evt.title}
                            </Link>
                            <div className="flex gap-3 mt-1 text-xs text-zinc-500 flex-wrap">
                              <span>
                                {evt.date
                                  ? new Date(evt.date).toLocaleDateString('pt-BR')
                                  : ''}
                              </span>
                              <span>&bull;</span>
                              <span className="truncate">{evt.location}</span>
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
                                aria-label={`Excluir evento ${evt.title}`}
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
                                  Tem certeza que deseja excluir <strong className="text-zinc-900">"{evt.title}"</strong>? Esta ação é permanente e não poderá ser desfeita. Todos os ingressos e dados associados serão removidos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <Button variant="outline" disabled={isDeleting}>
                                    Cancelar
                                  </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <Button
                                    variant="destructive"
                                    onClick={() => deleteMutation.mutate(evt.id)}
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
            <div className="text-center py-12 border border-dashed border-zinc-300 rounded-md">
              <p className="text-sm text-zinc-500">
                Você ainda não publicou nenhum evento.
              </p>
            </div>
          )}
        </div>

        {/* Recent Sales Sidebar */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-zinc-950">Métricas</h2>

          {loadingStats ? (
            <div className="text-center py-8 border border-dashed border-zinc-300 rounded-md">
              <div className="animate-pulse text-sm text-zinc-400">
                Carregando...
              </div>
            </div>
          ) : (
            <div className="border border-zinc-200 rounded-md bg-white p-6 space-y-4">
              <ul className="divide-y divide-zinc-100 space-y-4">
                <li className="pt-0 first:pt-0 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Eventos Publicados
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {publishedEvents}
                    </p>
                  </div>
                </li>
                <li className="pt-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Próximos Eventos
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {upcomingEvents}
                    </p>
                  </div>
                </li>
                <li className="pt-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        Receita Média / Evento
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">
                      R$ {averageRevenue.toFixed(2)}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <CreateEventModal
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  )
}
