import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Name */}
        <Link to="/" className="flex items-center space-x-2 text-zinc-900 transition-opacity hover:opacity-85">
          <svg
            className="h-6 w-6 text-zinc-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">Velas Ingressos</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            activeProps={{ className: 'text-zinc-950 font-medium' }}
            inactiveProps={{ className: 'text-zinc-500 hover:text-zinc-900' }}
            className="text-sm transition-colors"
          >
            Eventos
          </Link>
          <Link
            to="/organizer"
            activeProps={{ className: 'text-zinc-950 font-medium' }}
            inactiveProps={{ className: 'text-zinc-500 hover:text-zinc-900' }}
            className="text-sm transition-colors"
          >
            Área do Organizador
          </Link>
          <Link
            to="/gate"
            activeProps={{ className: 'text-zinc-950 font-medium' }}
            inactiveProps={{ className: 'text-zinc-500 hover:text-zinc-900' }}
            className="text-sm transition-colors"
          >
            Portaria
          </Link>
        </nav>
      </div>
    </header>
  )
}
