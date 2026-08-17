import { useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Film } from 'lucide-react'
import { useCreateEvent, usePublishEvent } from '#/hooks/useEvents'
import { useMovies } from '#/hooks/useMovies'
import { successToast } from '@/components/ui/toaster'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createEventSchema
} from '#/domain/schemas/event.schema'
import type { CreateEventSchema } from '#/domain/schemas/event.schema'
import type { EventMovie, MovieCatalogItem } from '#/domain/types/event.types'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_VALUES: CreateEventSchema = {
  movie: {
    name: '',
    description: '',
  },
  date: '',
  hours: '',
  local: '',
  capacity: 10,
  price: 0,
  publishAfter: true,
}

export function CreateEventModal({
  open,
  onOpenChange,
}: CreateEventModalProps) {
  const createMutation = useCreateEvent()
  const publishMutation = usePublishEvent()
  const { data: movies = [] } = useMovies()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting: formSubmitting, touchedFields },
  } = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })

  const watchedMovie = watch('movie')

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
    }
  }, [open, reset])

  const publishAfter = watch('publishAfter')

  const isSubmitting =
    formSubmitting || createMutation.isPending || publishMutation.isPending

  const movieMap = useMemo(() => {
    const map = new Map<string, EventMovie>()
    for (const m of movies) {
      map.set(m.name, {
        name: m.name,
        description: m.description,
      })
    }
    return map
  }, [movies])

  const showMovieError = Boolean(touchedFields.movie && errors.movie) ||
    Boolean(errors.movie && (formSubmitting || createMutation.isPending || publishMutation.isPending))

  const onSubmit = (values: CreateEventSchema) => {
    const { publishAfter: shouldPublish, ...payload } = values
    const createPayload = {
      movie: payload.movie,
      date: payload.date,
      hours: payload.hours,
      local: payload.local,
      capacity: payload.capacity,
      price: payload.price,
    }

    createMutation.mutate(createPayload, {
      onSuccess: (data: any) => {
        if (shouldPublish) {
          publishMutation.mutate(data.id, {
            onSuccess: () => {
              successToast(
                'Evento publicado com sucesso',
                `"${data.movie.name}" já está no ar.`,
              )
              onOpenChange(false)
            },
          })
        } else {
          successToast(
            'Evento criado (rascunho)',
            `"${data.movie.name}" salvo como rascunho.`,
          )
          onOpenChange(false)
        }
      },
    })
  }

  const inputErrorClass = (hasError: boolean): string =>
    hasError
      ? 'border-destructive focus:border-destructive focus:ring-destructive'
      : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="flex max-h-[92vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-zinc-100 px-6 py-4 shrink-0">
          <DialogTitle className="text-xl font-semibold text-zinc-950">
            Criar Novo Evento
          </DialogTitle>
          <DialogDescription>
            Selecione um filme e preencha os dados do evento.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-event-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5"
        >
          {/* Filme */}
          <div>
            <Label
              htmlFor="modal-movie"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              Filme
            </Label>
            <Select
                  value={watchedMovie.name || ''}
                  onValueChange={(name) => {
                    const movieData = movieMap.get(name) || { name: '', description: '' }
                    setValue('movie', movieData, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                    void trigger('movie')
                  }}
                  disabled={isSubmitting}
                  // onOpenChange={(isOpen) => {
                  //   if (!isOpen) {
                  //     setValue('movie', field.value, { shouldTouch: true })
                  //   }
                  // }}
                >
                  <SelectTrigger
                    id="modal-movie"
                    className={cn(
                      'w-full',
                      inputErrorClass(showMovieError)
                    )}
                  >
                    <SelectValue placeholder="Selecione um filme do catálogo">
                      {watchedMovie.name ? (
                        <span className="flex items-center gap-2">
                          <Film className="h-4 w-4 text-muted-foreground" />
                          {watchedMovie.name}
                        </span>
                      ) : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((m: MovieCatalogItem) => (
                      <SelectItem key={m.name} value={m.name}>
                        <div className="flex flex-col gap-0.5 max-w-[360px]">
                          <span className="font-medium">{m.name}</span>
                          {m.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {m.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            {showMovieError && (
              <p className="mt-1 text-xs text-destructive">
                {errors.movie?.name?.message ||
                  'Selecione um filme do catálogo'}
              </p>
            )}
          </div>

          {/* Date and Hours */}
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
                htmlFor="modal-hours"
                className="mb-1.5 block text-xs font-medium text-zinc-500"
              >
                Horário
              </Label>
              <Input
                type="time"
                id="modal-hours"
                disabled={isSubmitting}
                className={inputErrorClass(Boolean(errors.hours))}
                {...register('hours')}
              />
              {errors.hours && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.hours.message}
                </p>
              )}
            </div>
          </div>

          {/* Local */}
          <div>
            <Label
              htmlFor="modal-local"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              Local
            </Label>
            <Input
              type="text"
              id="modal-local"
              disabled={isSubmitting}
              placeholder="Ex: Cine Teatro Municipal"
              className={inputErrorClass(Boolean(errors.local))}
              {...register('local')}
            />
            {errors.local && (
              <p className="mt-1 text-xs text-destructive">
                {errors.local.message}
              </p>
            )}
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
                className={inputErrorClass(Boolean(errors.price))}
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Publish option */}
          <div className="flex items-start gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <Checkbox
              id="modal-publish"
              disabled={isSubmitting}
              checked={publishAfter}
              onCheckedChange={(v) =>
                reset(
                  {
                    ...(watch()),
                    publishAfter: Boolean(v),
                  },
                  {
                    keepValues: true,
                    keepErrors: true,
                    keepIsSubmitted: false,
                  },
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
