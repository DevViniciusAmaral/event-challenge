import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { ticketRepository } from '../data/repositories/ticket.repository'
import type {
  TicketSummary,
  PurchaseTicketRequest,
  ValidateTicketResponse,
} from '../domain/types/ticket.types'
import {
  successToast,
  errorToast,
  warningToast,
  extractBackendMessage,
} from '../components/ui/toaster'

export const useTicketById = (id: string) =>
  useSuspenseQuery({
    queryKey: ['ticket-detail', id],
    queryFn: async () => {
      const { data } = await ticketRepository.getById(id)
      return data
    },
  })

export const usePurchaseTicket = (
  eventId: string,
  options?: Omit<
    UseMutationOptions<TicketSummary, Error, PurchaseTicketRequest, unknown>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...(options as any),
    mutationFn: async (payload: PurchaseTicketRequest) => {
      const { data } = await ticketRepository.purchase(eventId, payload)
      return data
    },
    onSuccess: (...args: any[]) => {
      const data = args[0] as TicketSummary
      queryClient.invalidateQueries({ queryKey: ['list-events'], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['event-detail', eventId], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['organizer-events'], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['organizer-stats'], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['ticket-detail', data.id], refetchType: 'all' })
      successToast(
        'Compra confirmada!',
        `Código ${data.code || data.id} — redirecionando para o ingresso...`,
      )
      ;(options as any)?.onSuccess?.(...args)
    },
    onError: (...args: any[]) => {
      const err = args[0] as Error
      const rawMessage = extractBackendMessage(err)
      const title =
        rawMessage.toLowerCase().includes('capacidade') ||
        rawMessage.includes('INSUFFICIENT') ||
        rawMessage.includes('esgotado') ||
        rawMessage.includes('esgotados')
          ? 'Ingressos esgotados'
          : rawMessage.includes('NOT_PUBLISHED') ||
              rawMessage.toLowerCase().includes('publicado')
            ? 'Evento não publicado'
            : 'Erro ao comprar ingresso'

      errorToast(title, rawMessage)
      ;(options as any)?.onError?.(...args)
    },
  })
}

export const useValidateTicket = (
  options?: Omit<
    UseMutationOptions<ValidateTicketResponse, Error, string, unknown>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...(options as any),
    mutationFn: async (code: string) => {
      const { data } = await ticketRepository.validate(code)
      return data
    },
    onSuccess: (...args: any[]) => {
      const data = args[0] as ValidateTicketResponse
      if (data.valid && data.ticket) {
        queryClient.invalidateQueries({
          queryKey: ['ticket-detail', data.ticket.id],
          refetchType: 'all',
        })
        successToast(
          'Ingresso válido!',
          `${data.ticket.buyerName} pode entrar.`,
        )
      } else {
        warningToast(
          'Ingresso inválido',
          data.message || 'Não foi possível validar.',
        )
      }
      ;(options as any)?.onSuccess?.(...args)
    },
    onError: (...args: any[]) => {
      const err = args[0] as Error
      errorToast('Erro ao validar ingresso', extractBackendMessage(err))
      ;(options as any)?.onError?.(...args)
    },
  })
}
