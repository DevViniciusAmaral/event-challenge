import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CatchNotFound } from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEventById } from '../presentation/hooks/useEvents'
import { usePurchaseTicket } from '../presentation/hooks/useTickets'
import { mapEventDetailToEventItem } from '../presentation/mappers/viewMappers'
import { PageContainer } from '../components/PageContainer'
import { BackLink } from '../components/BackLink'
import { NotFoundState } from '../components/ErrorState'
import { QuantitySelector } from '../components/QuantitySelector'
import { FormInput } from '../components/FormField'
import { AlertBox } from '../components/AlertBox'
import { LoadingState } from '../components/LoadingState'
import { formatDateTime, formatPrice } from '@/lib/utils'
import {
  checkoutSchema,
  type CheckoutSchema,
} from '@/domain/schemas/ticket.schema'

const DEFAULT_VALUES: CheckoutSchema = {
  buyerName: '',
  buyerEmail: '',
  buyerCpf: '',
  quantity: 1,
  paymentMethod: 'pix',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
}

export const Route = createFileRoute('/events/$id/checkout')({
  component: Checkout,
  pendingComponent: () => (
    <PageContainer maxWidth="5xl" className="py-16">
      <LoadingState message="Carregando..." />
    </PageContainer>
  ),
  errorComponent: ({ error }) => (
    <CatchNotFound fallback={<NotFoundState title="Evento não encontrado" />}>
      <NotFoundState title="Erro ao carregar página" error={error} />
    </CatchNotFound>
  ),
})

function Checkout() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: eventDetail } = useEventById(id)

  const event = mapEventDetailToEventItem(eventDetail)

  const purchaseMutation = usePurchaseTicket(id, {
    onSuccess: (data) => {
      navigate({ to: '/tickets/$id', params: { id: data.id } })
    },
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting: formSubmitting, isValid },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })

  const qty = watch('quantity')
  const paymentMethod = watch('paymentMethod')

  if (!event) {
    return <NotFoundState title="Evento não encontrado" />
  }

  const unitPrice = event.price
  const total = unitPrice * qty

  const isSubmitting = formSubmitting || purchaseMutation.isPending
  const disabled = isSubmitting || event.available === 0

  const onSubmit = (values: CheckoutSchema) => {
    purchaseMutation.mutate({
      buyerName: values.buyerName,
      buyerEmail: values.buyerEmail,
      quantity: values.quantity,
    })
  }

  return (
    <PageContainer maxWidth="5xl">
      <BackLink
        to="/events/$id"
        params={{ id: event.id }}
        label="Voltar para Detalhes"
      />

      <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl mb-8">
        Finalizar Compra
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3" noValidate>
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
            <h2 className="text-base font-medium text-zinc-900">
              Informações de Contato
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormInput
                  label="Nome Completo"
                  id="name"
                  type="text"
                  required
                  disabled={disabled}
                  placeholder="Seu nome"
                  error={errors.buyerName?.message}
                  {...register('buyerName')}
                />
              </div>

              <FormInput
                label="E-mail"
                id="email"
                type="email"
                required
                disabled={disabled}
                placeholder="voce@exemplo.com"
                error={errors.buyerEmail?.message}
                {...register('buyerEmail')}
              />

              <FormInput
                label="CPF"
                id="cpf"
                type="text"
                required
                disabled={disabled}
                placeholder="000.000.000-00"
                error={errors.buyerCpf?.message}
                {...register('buyerCpf')}
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
            <h2 className="text-base font-medium text-zinc-900">
              Forma de Pagamento
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <>
                    <label
                      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                        field.value === 'pix'
                          ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                          : 'border-zinc-200 hover:border-zinc-300'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value="pix"
                        checked={field.value === 'pix'}
                        onChange={() => !disabled && field.onChange('pix')}
                        disabled={disabled}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full border-2 border-zinc-300 flex items-center justify-center">
                          {field.value === 'pix' && (
                            <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            PIX
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            Aprovação instantânea
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                        field.value === 'card'
                          ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                          : 'border-zinc-200 hover:border-zinc-300'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value="card"
                        checked={field.value === 'card'}
                        onChange={() => !disabled && field.onChange('card')}
                        disabled={disabled}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full border-2 border-zinc-300 flex items-center justify-center">
                          {field.value === 'card' && (
                            <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            Cartão de Crédito
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            Parcele em até 12x
                          </p>
                        </div>
                      </div>
                    </label>
                  </>
                )}
              />
            </div>
            {errors.paymentMethod?.message && (
              <p className="text-xs text-destructive">
                {errors.paymentMethod.message}
              </p>
            )}

            {paymentMethod === 'card' && (
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-zinc-100">
                <div className="sm:col-span-2">
                  <FormInput
                    label="Número do Cartão"
                    id="cardNumber"
                    type="text"
                    disabled={disabled}
                    placeholder="0000 0000 0000 0000"
                    error={errors.cardNumber?.message}
                    {...register('cardNumber')}
                  />
                </div>
                <FormInput
                  label="Nome no Cartão"
                  id="cardName"
                  type="text"
                  disabled={disabled}
                  placeholder="Como impresso no cartão"
                  error={errors.cardName?.message}
                  {...register('cardName')}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Validade"
                    id="cardExpiry"
                    type="text"
                    disabled={disabled}
                    placeholder="MM/AA"
                    error={errors.cardExpiry?.message}
                    {...register('cardExpiry')}
                  />
                  <FormInput
                    label="CVV"
                    id="cardCvv"
                    type="text"
                    disabled={disabled}
                    placeholder="123"
                    error={errors.cardCvv?.message}
                    {...register('cardCvv')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-5 sticky top-4">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-zinc-100">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                {formatDateTime(event.date, event.time)}
              </p>
              <h3 className="mt-1 text-lg font-medium text-zinc-950">
                {event.title}
              </h3>
              <p className="mt-0.5 text-sm text-zinc-500">{event.location}</p>
            </div>

            <div className="space-y-3 border-t border-zinc-100 pt-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2">
                  Quantidade
                </label>
                <Controller
                  control={control}
                  name="quantity"
                  render={({ field }) => (
                    <QuantitySelector
                      size="sm"
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      min={1}
                      max={Math.max(1, event.available || 1)}
                      disabled={disabled}
                    />
                  )}
                />
                {errors.quantity?.message && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">
                  {formatPrice(unitPrice)} × {qty}
                </span>
                <span className="font-medium text-zinc-900">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-base">
                <span className="font-semibold text-zinc-900">Total</span>
                <span className="font-bold text-zinc-950">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={disabled || !isValid}
              className="w-full rounded bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Processando pagamento...'
                : event.available === 0
                  ? 'Ingressos esgotados'
                  : `Pagar ${formatPrice(total)}`}
            </button>

            {purchaseMutation.isError && (
              <AlertBox
                title="Erro ao realizar compra"
                error={purchaseMutation.error}
              />
            )}
          </div>
        </div>
      </form>
    </PageContainer>
  )
}
