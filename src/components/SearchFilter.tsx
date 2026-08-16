interface SearchFilterProps {
  search: string
  onSearchChange: (value: string) => void
}

export function SearchFilter({ search, onSearchChange }: SearchFilterProps) {
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
    </div>
  )
}
