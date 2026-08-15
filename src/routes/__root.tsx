import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Toaster } from '../components/ui/toaster'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { NotFoundPage } from '../components/not-found'

import appCss from '../styles.css?url'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        const status = error?.response?.status
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Velas Ingressos - Plataforma de Eventos' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <QueryClientProvider client={queryClient}>
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
          <Toaster />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
