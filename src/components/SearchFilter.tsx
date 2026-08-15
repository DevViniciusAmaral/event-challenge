interface SearchFilterProps {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: 'all' | 'show' | 'movie'
  onTypeFilterChange: (value: 'all' | 'show' | 'movie') => void
}

export function SearchFilter({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: SearchFilterProps) {
  const types: Array<{
    value: 'all' | 'show' | 'movie'
    label: string
  }> = [
    { value: 'all', label: 'Todos' },
    { value: 'show', label: 'Shows' },
    { value: 'movie', label: 'Cinema' },
  ]

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Buscar por evento ou local..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      <div className="flex gap-2">
        {types.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTypeFilterChange(value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              typeFilter === value
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
