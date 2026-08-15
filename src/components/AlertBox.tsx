import { cn } from '@/lib/utils'

type AlertBoxVariant = 'error' | 'warning' | 'success' | 'info'

interface AlertBoxProps {
  title: string
  message?: string
  error?: unknown
  variant?: AlertBoxVariant
  className?: string
}

const variants: Record<AlertBoxVariant, string> = {
  error: 'border-red-200 bg-red-50/50 text-red-800',
  warning: 'border-amber-200 bg-amber-50/50 text-amber-800',
  success: 'border-emerald-200 bg-emerald-50/50 text-emerald-800',
  info: 'border-zinc-200 bg-zinc-50/50 text-zinc-800',
}

const titleSizes: Record<AlertBoxVariant, string> = {
  error: 'text-xs font-medium',
  warning: 'text-sm font-semibold',
  success: 'text-sm font-semibold',
  info: 'text-xs font-medium',
}

const messageSizes: Record<AlertBoxVariant, string> = {
  error: 'text-2xs text-red-600',
  warning: 'text-xs text-amber-600',
  success: 'text-xs text-emerald-600',
  info: 'text-2xs text-zinc-600',
}

export function AlertBox({
  title,
  message,
  error,
  variant = 'error',
  className,
}: AlertBoxProps) {
  const body = (error instanceof Error ? error.message : undefined) || message

  return (
    <div
      className={cn(
        'rounded-md border p-3 md:p-4',
        variants[variant],
        className,
      )}
    >
      <p className={titleSizes[variant]}>{title}</p>
      {body && (
        <p className={cn('mt-0.5 md:mt-1', messageSizes[variant])}>{body}</p>
      )}
    </div>
  )
}
