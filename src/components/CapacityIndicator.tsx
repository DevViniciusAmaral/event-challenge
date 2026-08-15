interface CapacityIndicatorProps {
  available: number
  capacity: number
}

export function CapacityIndicator({
  available,
  capacity,
}: CapacityIndicatorProps) {
  const sold = Math.max(0, capacity - available)
  const percentage = capacity > 0 ? Math.round((sold / capacity) * 100) : 0
  const remaining = 100 - percentage

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-500">Disponibilidade</span>
        <span className="font-medium text-zinc-900">
          {available} / {capacity} restantes
        </span>
      </div>
      <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-zinc-900 transition-all"
          style={{ width: `${remaining}%` }}
        />
      </div>
    </div>
  )
}
