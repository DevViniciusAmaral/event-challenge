import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { mockCatalog } from '#/utils/mocks'
import { useCreateEvent, usePublishEvent } from '../presentation/hooks/useEvents'

export const Route = createFileRoute('/organizer/events/new')({
  component: NewEvent,
})

function NewEvent() {
  const navigate = useNavigate()

  const createMutation = useCreateEvent()
  const publishMutation = usePublishEvent()

  const [catalogId, setCatalogId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [address, setAddress] = useState('')
  const [capacity, setCapacity] = useState<number>(100)
  const [price, setPrice] = useState<number>(0)
  const [image, setImage] = useState('')

  const [publishAfter, setPublishAfter] = useState(true)

  const handleCatalogChange = (id: string) => {
    setCatalogId(id)
    const selected = mockCatalog.find((item) => item.id === id)
    if (selected) {
      setTitle(selected.title)
      setDescription(selected.description)
      setImage(selected.coverImage)
    }
  }

  const isSubmitting = createMutation.isPending || publishMutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date || !time || !location || !address) return

    const payload = {
      title,
      description,
      date,
      time,
      venue: location,
      address,
      capacity,
      ticketPrice: price,
      imageUrl:
        image ||
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=80',
    }

    createMutation.mutate(payload, {
      onSuccess: (data) => {
        if (publishAfter) {
          publishMutation.mutate(data.id, {
            onSuccess: () => {
              navigate({ to: '/organizer' })
            },
          })
        } else {
          navigate({ to: '/organizer' })
        }
      },
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/organizer"
        className="inline-flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <svg
          className="mr-1.5 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para o Painel
      </Link>

      <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl mb-8">
        Criar Novo Evento
      </h1>

      {createMutation.isError && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50/50 p-4">
          <p className="text-xs font-medium text-red-800">
            Erro ao criar evento
          </p>
          <p className="text-xs text-red-600 mt-1">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Tente novamente.'}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6"
      >
        {/* Catalog selection */}
        <div>
          <label
            htmlFor="catalog"
            className="block text-xs font-medium text-zinc-500 mb-1.5"
          >
            Importar do Catálogo Externo (Opcional)
          </label>
          <select
            id="catalog"
            value={catalogId}
            onChange={(e) => handleCatalogChange(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
          >
            <option value="">
              Selecione um filme ou show para preencher...
            </option>
            {mockCatalog.map((item) => (
              <option key={item.id} value={item.id}>
                [{item.type === 'show' ? 'Show' : 'Cinema'}] {item.title} (
                {item.artistOrDirector})
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-zinc-100 pt-6" />

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-medium text-zinc-500 mb-1.5"
          >
            Título do Evento
          </label>
          <input
            type="text"
            id="title"
            required
            disabled={isSubmitting}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Show de Jazz Acústico"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-medium text-zinc-500 mb-1.5"
          >
            Descrição
          </label>
          <textarea
            id="description"
            rows={3}
            disabled={isSubmitting}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes sobre o evento..."
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
          />
        </div>

        {/* Date and Time */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              required
              disabled={isSubmitting}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
            />
          </div>
          <div>
            <label
              htmlFor="time"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Horário
            </label>
            <input
              type="time"
              id="time"
              required
              disabled={isSubmitting}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
            />
          </div>
        </div>

        {/* Location and Address */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="location"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Local
            </label>
            <input
              type="text"
              id="location"
              required
              disabled={isSubmitting}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Teatro Municipal"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Endereço Completo
            </label>
            <input
              type="text"
              id="address"
              required
              disabled={isSubmitting}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Av. Principal, 123"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
            />
          </div>
        </div>

        {/* Capacity and Price */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="capacity"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Capacidade Máxima
            </label>
            <input
              type="number"
              id="capacity"
              required
              min={1}
              disabled={isSubmitting}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-xs font-medium text-zinc-500 mb-1.5"
            >
              Preço do Ingresso (R$)
            </label>
            <input
              type="number"
              id="price"
              required
              min={0}
              step="0.01"
              disabled={isSubmitting}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0.00 para gratuito"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="image"
            className="block text-xs font-medium text-zinc-500 mb-1.5"
          >
            URL da Imagem de Capa
          </label>
          <input
            type="url"
            id="image"
            disabled={isSubmitting}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
          />
        </div>

        {/* Publish option */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="publish"
            checked={publishAfter}
            onChange={(e) => setPublishAfter(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
          />
          <div>
            <label
              htmlFor="publish"
              className="text-sm font-medium text-zinc-900"
            >
              Publicar imediatamente
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Desmarque para criar como rascunho e publicar depois.
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Criando evento...'
            : publishAfter
              ? 'Criar e Publicar Evento'
              : 'Criar Evento (Rascunho)'}
        </button>
      </form>
    </div>
  )
}
