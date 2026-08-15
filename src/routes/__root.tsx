import { HeadContent, Scripts, createRootRoute, Navigate } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { QueryProvider } from '../presentation/config/QueryProvider'
import { Toaster } from '../components/ui/toaster'
import { PageContainer } from '../components/PageContainer'

import appCss from '../styles.css?url'

const NOT_FOUND_REDIRECT_MS = 3000

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Velas Ingressos - Plataforma de Eventos',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  defaultNotFoundComponent: GlobalNotFound,
})

function GlobalNotFound() {
  const [remainingSec, setRemainingSec] = useState(
    Math.ceil(NOT_FOUND_REDIRECT_MS / 1000),
  )

  useEffect(() => {
    const startMs = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startMs
      const secsLeft = Math.max(
        0,
        Math.ceil((NOT_FOUND_REDIRECT_MS - elapsed) / 1000),
      )
      setRemainingSec(secsLeft)
      if (secsLeft <= 0) clearInterval(interval)
    }, 250)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageContainer maxWidth="md" className="py-16">
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-400 tracking-widest uppercase mb-2">
          404
        </p>
        <h1 className="text-4xl font-bold text-zinc-950">Conteúdo não encontrado</h1>
        <p className="mt-4 text-sm text-zinc-500">
          Voltando para a página inicial em{' '}
          <span className="font-semibold text-zinc-900 tabular-nums">
            {remainingSec}s
          </span>
          ...
        </p>
        <div className="mt-8">
          <Navigate to="/" type="replace">
            {(btnProps) => (
              <button
                {...btnProps}
                className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Ir para home agora
              </button>
            )}
          </Navigate>
        </div>
      </div>
    </PageContainer>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <QueryProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem-116px)]">{children}</main>
          <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p>
                &copy; {new Date().getFullYear()} Velas Ingressos. Todos os
                direitos reservados. Desafio Técnico.
              </p>
            </div>
          </footer>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Toaster />
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
