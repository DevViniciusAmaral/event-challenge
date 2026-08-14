import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
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

const queryKeys = {
  all: ['tickets'] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
}

const eventsQueryKeys = {
  all: ['events'] as const,
}

const organizerQueryKeys = {
  all: ['organizer'] as const,
}

export function useTicketById(
  id: string,
  options?: Omit<UseQueryOptions<TicketDetail, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: async () => {
      const { data } = await ticketRepository.getById(id)
      return data
    },
    enabled: Boolean(id),
    ...options,
  })
}

export function usePurchaseTicket(
  eventId: string,
  options?: Omit<
    UseMutationOptions<TicketSummary, Error, PurchaseTicketRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: async (payload: PurchaseTicketRequest) => {
      const { data } = await ticketRepository.purchase(eventId, payload)
      return data
    },
    onSuccess: async (data, variables, ctx) => {
      queryClient.setQueryData(queryKeys.detail(data.id), {
        ...data,
        event: {
          id: eventId,
          title: '',
          date: '',
          time: '',
          venue: '',
        },
      } as unknown as TicketDetail)

      queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: organizerQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.all })

      await Promise.allSettled([
        queryClient.refetchQueries({ queryKey: eventsQueryKeys.all, type: 'active' }),
        queryClient.refetchQueries({ queryKey: organizerQueryKeys.all, type: 'active' }),
        queryClient.refetchQueries({ queryKey: queryKeys.all, type: 'active' }),
      ])

      successToast(
        'Compra confirmada!',
        `Código ${data.code || data.id} — redirecionando para o ingresso...`,
      )

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnSuccess?.(data, variables, ctx)
    },
    onError: async (err, variables, ctx) => {
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

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnError?.(err, variables, ctx)
    },
    ...restOptions,
  })
}

export function useValidateTicket(
  options?: Omit<
    UseMutationOptions<ValidateTicketResponse, Error, string>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options ?? {}

  return useMutation({
    mutationFn: async (code: string) => {
      const { data } = await ticketRepository.validate(code)
      return data
    },
    onSuccess: async (data, code, ctx) => {
      if (data.valid && data.ticket) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.detail(data.ticket.id),
        })
        successToast('Ingresso válido!', `${data.ticket.buyerName} pode entrar.`)
      } else {
        warningToast('Ingresso inválido', data.message || 'Não foi possível validar.')
      }

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnSuccess?.(data, code, ctx)
    },
    onError: async (err, code, ctx) => {
      errorToast('Erro ao validar ingresso', extractBackendMessage(err))

      // @ts-expect-error - TanStack v5 TContext overload; runtime-safe forward.
      await userOnError?.(err, code, ctx)
    },
    ...restOptions,
  })
}
