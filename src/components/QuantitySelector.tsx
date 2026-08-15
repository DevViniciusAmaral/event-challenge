import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  disabled,
  size = 'md',
}: QuantitySelectorProps) {
  const heightClass = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const valueWrapper = size === 'sm' ? 'w-6' : 'flex-1'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          heightClass,
          'flex items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        -
      </button>
      <span
        className={cn(valueWrapper, 'text-center font-medium text-zinc-900')}
      >
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() =>
          onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)
        }
        className={cn(
          heightClass,
          'flex items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        +
      </button>
    </div>
  )
}
