import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  isLoading?: boolean
  className?: string
}

export function MetricCard({
  label,
  value,
  isLoading,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-zinc-200 rounded-md p-6',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-light text-zinc-900">
        {isLoading ? (
          <span className="animate-pulse text-zinc-300">—</span>
        ) : (
          value
        )}
      </p>
    </div>
  )
}
