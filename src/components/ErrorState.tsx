import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title: string
  message?: string
  error?: unknown
  className?: string
  backTo?: string
  backLabel?: string
  onRetry?: () => void
}

export function ErrorState({
  title,
  message,
  error,
  className,
  backTo,
  backLabel,
  onRetry,
}: ErrorStateProps) {
  const defaultMessage =
    (error instanceof Error ? error.message : undefined) || message

  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50/50 py-16 text-center',
        className,
      )}
    >
      <p className="text-sm font-medium text-red-800">{title}</p>
      {defaultMessage && (
        <p className="mt-1 text-xs text-red-600">{defaultMessage}</p>
      )}
      {(onRetry || backTo) && (
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          {backTo && (
            <Link
              to={backTo}
              className="inline-flex items-center text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
            >
              {backLabel || 'Voltar para a página inicial'}
            </Link>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface NotFoundStateProps {
  title: string
  message?: string
  error?: unknown
  backTo?: string
  backLabel?: string
}

export function NotFoundState({
  title,
  message,
  error,
  backTo = '/',
  backLabel = 'Voltar para a página inicial',
}: NotFoundStateProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <h2 className="text-xl font-medium text-zinc-900">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">
        {error instanceof Error
          ? error.message
          : message ||
            'O item solicitado pode ter sido removido ou não existe.'}
      </p>
      <Link
        to={backTo}
        className="mt-6 inline-flex items-center text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
      >
        {backLabel}
      </Link>
    </div>
  )
}
