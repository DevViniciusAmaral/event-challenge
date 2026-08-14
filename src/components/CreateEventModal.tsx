import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateEvent, usePublishEvent } from '@/presentation/hooks/useEvents'
import { successToast } from '@/components/ui/toaster'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createEventSchema,
  type CreateEventSchema,
} from '#/domain/schemas/event.schema'

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=80'

const DEFAULT_VALUES: CreateEventSchema = {
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  address: '',
  capacity: 10,
  ticketPrice: 0,
  imageUrl: '',
  publishAfter: true,
}

export function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const createMutation = useCreateEvent()
  const publishMutation = usePublishEvent()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
    }
  }, [open, reset])

  const publishAfter = watch('publishAfter')
  const image = watch('imageUrl')

  const isSubmitting =
    formSubmitting || createMutation.isPending || publishMutation.isPending

  const onSubmit = (values: CreateEventSchema) => {
    const {
      publishAfter: shouldPublish,
      imageUrl,
      ...payloadBody
    } = values

    const payload = {
      ...payloadBody,
      imageUrl: imageUrl || DEFAULT_IMAGE,
    }

    createMutation.mutate(payload, {
      onSuccess: (data) => {
        if (shouldPublish) {
          publishMutation.mutate(data.id, {
            onSuccess: () => {
              successToast(
                'Evento publicado com sucesso',
                `"${data.title}" já está no ar.`,
              )
              onOpenChange(false)
            },
          })
        } else {
          successToast(
            'Evento criado (rascunho)',
            `"${data.title}" salvo como rascunho.`,
          )
          onOpenChange(false)
        }
      },
    })
  }

  const inputErrorClass = (
    hasError: boolean,
  ): string => (hasError ? 'border-destructive focus:border-destructive focus:ring-destructive' : '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-zinc-100 px-6 py-4 shrink-0">
          <DialogTitle className="text-xl font-semibold text-zinc-950">
            Criar Novo Evento
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar um novo evento.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-event-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5"
        >
          {/* Title */}
          <div>
            <Label
              htmlFor="modal-title"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              Título do Evento
            </Label>
            <Input
              type="text"
              id="modal-title"
              disabled={isSubmitting}
              placeholder="Ex: Show de Jazz Acústico"
              className={inputErrorClass(Boolean(errors.title))}
              {...register('title')}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="modal-description"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              Descrição
            </Label>
            <Textarea
              id="modal-description"
              rows={3}
              disabled={isSubmitting}
              placeholder="Detalhes sobre o evento..."
              className={inputErrorClass(Boolean(errors.description))}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label
                htmlFor="modal-date"
                className="mb-1.5 block text-xs font-medium text-zinc-500"
              >
                Data
              </Label>
              <Input
                type="date"
                id="modal-date"
                disabled={isSubmitting}
                className={inputErrorClass(Boolean(errors.date))}
                {...register('date')}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="modal-time"
                className="mb-1.5 block text-xs font-medium text-zinc-500"
              >
                Horário
              </Label>
              <Input
                type="time"
                id="modal-time"
                disabled={isSubmitting}
                className={inputErrorClass(Boolean(errors.time))}
                {...register('time')}
              />
              {errors.time && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Location and Address */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label
                htmlFor="modal-location"
                className="mb-1.5 block text-xs font-medium text-zinc-500"
              >
                Local
              </Label>
              <Input
                type="text"
                id="modal-location"
                disabled={isSubmitting}
                placeholder="Ex: Teatro Municipal"
                className={inputErrorClass(Boolean(errors.venue))}
                {...register('venue')}
              />
              {errors.venue && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.venue.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="modal-address"
                className="mb-1.5 block text-xs font-medium text-zinc-500"
              >
                Endereço Completo
              </Label>
              <Input
                type="text"
                id="modal-address"
                disabled={isSubmitting}
                placeholder="Ex: Av. Principal, 123"
                className={inputErrorClass(Boolean(errors.address))}
                {...register('address')}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Capacity and Price */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label
                htmlFor="modal-capacity"
                className="mb-1.5 block text-xs font-medium text-zinc-500"
              >
                Capacidade Máxima
              </Label>
              <Input
                type="number"
                id="modal-capacity"
                min={1}
                disabled={isSubmitting}
                className={inputErrorClass(Boolean(errors.capacity))}
                {...register('capacity', { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.capacity.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="modal-price"
                className="mb-1.5 block text-xs font-medium text-zinc-500"
              >
                Preço do Ingresso (R$)
              </Label>
              <Input
                type="number"
                id="modal-price"
                min={0}
                step="0.01"
                disabled={isSubmitting}
                placeholder="0.00 para gratuito"
                className={inputErrorClass(Boolean(errors.ticketPrice))}
                {...register('ticketPrice', { valueAsNumber: true })}
              />
              {errors.ticketPrice && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.ticketPrice.message}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <Label
              htmlFor="modal-image"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              URL da Imagem de Capa
            </Label>
            <Input
              type="url"
              id="modal-image"
              disabled={isSubmitting}
              placeholder="https://exemplo.com/imagem.jpg"
              className={inputErrorClass(Boolean(errors.imageUrl))}
              {...register('imageUrl')}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
            {image && !errors.imageUrl && (
              <p className="mt-2 text-xs text-zinc-500 truncate">
                Prévia: {image}
              </p>
            )}
          </div>

          {/* Publish option */}
          <div className="flex items-start gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <Checkbox
              id="modal-publish"
              disabled={isSubmitting}
              checked={publishAfter}
              onCheckedChange={(v) =>
                reset(
                  { ...(watch() as CreateEventSchema), publishAfter: Boolean(v) },
                  { keepValues: true, keepErrors: true, keepIsSubmitted: false },
                )
              }
            />
            <div className="flex-1">
              <label
                htmlFor="modal-publish"
                className="text-sm font-medium text-zinc-900"
              >
                Publicar imediatamente
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">
                Desmarque para criar como rascunho e publicar depois.
              </p>
            </div>
          </div>
          <input type="hidden" {...register('publishAfter')} />
        </form>

        <DialogFooter className="border-t border-zinc-100 px-6 py-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-event-form"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Criando evento...'
              : publishAfter
                ? 'Criar e Publicar Evento'
                : 'Criar Evento (Rascunho)'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
