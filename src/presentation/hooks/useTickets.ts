import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { ticketRepository } from '../../data/repositories/ticket.repository'
import type {
  TicketDetail,
  TicketSummary,
  PurchaseTicketRequest,
  ValidateTicketResponse,
} from '../../domain/types/ticket.types'
import {
  successToast,
  errorToast,
  warningToast,
  extractBackendMessage,
} from '../../components/ui/toaster'

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
    UseMutationOptions<TicketSummary, Error, PurchaseTicketRequest>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PurchaseTicketRequest) => {
      const { data } = await ticketRepository.purchase(eventId, payload)
      return data
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['organizer'] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      successToast(
        'Compra confirmada!',
        `Código ${data.code || data.id} — redirecionando para o ingresso...`,
      )
      options?.onSuccess?.(data, variables, ctx)
    },
    onError: (err, variables, ctx) => {
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
      options?.onError?.(err, variables, ctx)
    },
    ...options,
  })
}

export const useValidateTicket = (
  options?: Omit<
    UseMutationOptions<ValidateTicketResponse, Error, string>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await ticketRepository.validate(code)
      return data
    },
    onSuccess: (data, code, ctx) => {
      if (data.valid && data.ticket) {
        queryClient.invalidateQueries({
          queryKey: ['ticket-detail', data.ticket.id],
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
      options?.onSuccess?.(data, code, ctx)
    },
    onError: (err, code, ctx) => {
      errorToast('Erro ao validar ingresso', extractBackendMessage(err))
      options?.onError?.(err, code, ctx)
    },
    ...options,
  })
}
