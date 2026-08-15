import { useNavigate } from '@tanstack/react-router'
import { PageContainer } from './PageContainer'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <PageContainer maxWidth="md" className="py-20">
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold text-zinc-400 tracking-widest uppercase mb-2">
          Erro 404
        </p>
        <h1 className="text-5xl font-bold text-zinc-950 sm:text-6xl">
          Página não encontrada
        </h1>

        <button
          onClick={() => navigate({ to: '/', replace: true })}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
        >
          Ir para a home agora
        </button>
      </div>
    </PageContainer>
  )
}
