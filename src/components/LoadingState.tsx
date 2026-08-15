import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({
  message = 'Carregando...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-zinc-300 py-16 text-center',
        className,
      )}
    >
      <div className="animate-pulse text-sm text-zinc-400">{message}</div>
    </div>
  )
}
