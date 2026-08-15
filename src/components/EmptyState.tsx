import { cn } from '@/lib/utils'

interface EmptyStateProps {
  message: string
  className?: string
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-zinc-300 py-16 text-center',
        className,
      )}
    >
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  )
}
