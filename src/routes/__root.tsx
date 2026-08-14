import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Header } from '../components/Header'
import { QueryProvider } from '../presentation/config/QueryProvider'
import { Toaster } from '../components/ui/toaster'

import appCss from '../styles.css?url'

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
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <QueryProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem-116px)]">
            {children}
          </main>
          <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p>&copy; {new Date().getFullYear()} Velas Ingressos. Todos os direitos reservados. Desafio Técnico.</p>
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
