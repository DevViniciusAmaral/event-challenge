# 🎟️ Plataforma de Eventos e Ingressos

Projeto fullstack de plataforma de eventos com três fluxos principais: **Organizador** (cria e publica eventos), **Cliente** (busca, reserva e compra ingressos) e **Portaria** (valida ingressos na entrada, inclusive por câmera/QR Code). Desenvolvido com **TanStack Start**, **React 19**, **Vite 8**, **Tailwind CSS v4** e **TypeScript strict mode**.

Escopo do desafio técnico e regras de avaliação em [CHALLENGE.md](file:///C:/Users/vinia/projects/event-challenge/CHALLENGE.md).

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) **>= 20 LTS** (recomendado 22+)
- Gerenciador de pacotes: `npm`, `pnpm`, `yarn` ou `bun` (bun.lock versionado no repo)
- Backend da API de eventos rodando (ver **Variáveis de Ambiente** abaixo)

### Pré-requisitos p/ Leitura de QR Code por Câmera

- Navegador moderno com suporte a `MediaDevices.getUserMedia`
- Conexão **HTTPS** ou **localhost** (câmera é bloqueada em HTTP não-local)
- Dispositivo com pelo menos uma câmera física (`videoinput` detectado via `enumerateDevices()`)

---

## 🚀 Como Executar

### 1. Instalar dependências

```bash
npm install
# ou pnpm install / bun install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (já está no `.gitignore`) com a URL da API:

```env
VITE_API_URL=http://localhost:8080/api
```

> `VITE_API_URL` é obrigatória. Sem ela, nenhuma operação de create/publish/delete/listar eventos ou comprar/validar ingressos funciona.

### 3. Rodar em ambiente de desenvolvimento

```bash
npm run dev
```

Aplicação abre em [http://localhost:3000](http://localhost:3000).

> Observação: o TanStack Router gera o `routeTree.gen.ts` automaticamente em modo dev.

---

## 🛠️ Comandos Úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia Vite dev server na porta 3000 |
| `npm run build` | Build otimizado de produção (cliente + SSR via Nitro) em `.output/` |
| `npm run preview` | Sobe build de produção localmente para preview |
| `npm run generate-routes` | Re-gera `src/routeTree.gen.ts` manualmente (plugin do TanStack Router) |
| `npm run lint` | Executa ESLint em todos os arquivos |
| `npm run format` | Prettier formata + ESLint `--fix` em tudo |
| `npm run check` | Apenas verifica formatação Prettier (sem corrigir) |

---

## 🗺️ Rotas Disponíveis

| Rota | Página | Perfil | O que faz |
|---|---|---|---|
| `/` | Home | Cliente | Lista eventos publicados com busca por nome do filme/descrição (filtro local) |
| `/events/$id` | Detalhe do evento | Cliente | Tela com infos, capacidade e formulário de compra de ingresso |
| `/tickets/$id` | Ingresso | Cliente | Exibe ingresso com QR Code e dados da compra |
| `/organizer` | Dashboard | Organizador | Métricas, listagem de eventos criados, ações (publicar, excluir, criar novo) |
| `/gate` | Validação | Portaria | Valida ingresso por código digitado **ou leitura de QR Code por câmera** |
| Qualquer URL inválida | 404 | Todos | Página "não encontrada" com redirecionamento automático para `/` em 3s |

---

## 🏗️ Arquitetura

Projeto segue **arquitetura em camadas** inspirada em Domain-Driven Design (DDD), mantendo responsabilidades bem separadas:

```
src/
├── components/              # Componentes UI reutilizáveis
│   ├── ui/                  # shadcn components (button, dialog, toast etc.)
│   ├── AlertBox.tsx         # Variantes error/warning/success/info
│   ├── BackLink.tsx         # Link "voltar" com ícone
│   ├── CapacityIndicator.tsx# Barra de disponibilidade do evento
│   ├── CreateEventModal.tsx # Modal criar + publicar evento (inputs nativos date/time + RHF + Zod)
│   ├── EmptyState.tsx       # Estado "nenhum resultado" — diferencia busca vs. lista vazia
│   ├── ErrorState.tsx       # Error state + NotFoundState (404)
│   ├── EventCard.tsx        # Card de evento na home (hero gradiente + ícone Film, sem imagem)
│   ├── FormField.tsx        # FormInput / FormTextarea / FormSelect compartilhados
│   ├── Header.tsx           # Header fixo global com navegação entre páginas
│   ├── LoadingState.tsx     # Skeleton loading padrão
│   ├── MetricCard.tsx       # Card de métrica do organizador
│   ├── PageContainer.tsx    # Wrapper padrão de página
│   ├── PageHeader.tsx       # Header com título + descrição + ações
│   ├── QrCodeScanner.tsx    # Scanner de QR Code por câmera (ZXing) com detecção de dispositivo
│   ├── QuantitySelector.tsx # Botões +/- quantidade de ingressos
│   ├── SearchFilter.tsx     # Barra de busca text-only (por nome do filme / descrição)
│   ├── TicketCard.tsx       # Card com QR Code do ingresso + dados normalizados
│   └── not-found.tsx        # Página 404 com redirecionamento automático
│
├── data/
│   ├── api/apiClient.ts     # Instância singleton do axios + interceptors
│   └── repositories/        # Repository pattern: 1 repo por agregado
│       ├── event.repository.ts
│       ├── movie.repository.ts
│       ├── organizer.repository.ts
│       └── ticket.repository.ts
│
├── types/                   # Tipos TypeScript de domínio (puros, sem import de lib)
│   ├── event.types.ts       # EventStatus, interface EventItem, EventMovie etc.
│   ├── organizer.types.ts
│   └── ticket.types.ts
│
├── schemas/
│   └── event.schema.ts      # Schemas Zod (CreateEventRequest + transform)
│
├── hooks/                   # Custom hooks com TanStack Query v5
│   ├── use-toast.ts         # Hook shadcn/toaster
│   ├── useEvents.ts         # usePublishedEvents / useEventById / create/publish/delete
│   ├── useMovies.ts         # useMovies (lista de filmes para o select do modal)
│   ├── useOrganizer.ts      # useOrganizerEvents / useOrganizerStats
│   └── useTickets.ts        # useTicketById / usePurchaseTicket / useValidateTicket
│
├── utils/
│   └── viewMappers.ts       # normalizeMovie / normalizeHours / normalizeLocal /
│                            # mapTicketEventInfo — normaliza payloads legados vs. novos
│
├── routes/                  # File-based routing do TanStack Router
│   ├── __root.tsx           # Root route (QueryClient defaults, Header, notFoundComponent)
│   ├── index.tsx            # / (home)
│   ├── events.$id.tsx       # /events/$id
│   ├── tickets.$id.tsx      # /tickets/$id
│   ├── organizer.tsx        # /organizer
│   └── gate.tsx             # /gate
│
├── lib/utils.ts             # cn(), formatPrice(), formatDate(), formatDateTime()
├── router.tsx               # Criação do router singleton
└── styles.css               # Tailwind v4 imports + tema base
```

### Padrões e convenções

- **Repository pattern**: toda comunicação com API passa por `src/data/repositories/*` — componentes não chamam axios diretamente
- **Custom hooks em `src/hooks/*`**: `useSuspenseQuery` + `useMutation` do TanStack Query v5 com query keys centralizadas:
  - `['list-events']`, `['event-detail', id]`, `['movies']`, `['organizer-events']`, `['organizer-stats']`, `['ticket-detail', id]`
- **QueryClient defaults** (configurado em `__root.tsx`): `staleTime: 0`, `refetchOnMount: true`, queries falham imediatamente em 4xx e retentam 2x em outros erros; mutations sempre têm `retry: false`
- **Invalidação de cache**: sempre `queryClient.invalidateQueries({ queryKey: prefixo, refetchType: 'all' })`, **um prefixo por chamada** (não usar arrays compostos)
- **Ordem do spread em useMutation**: `...(options as any)` vem **no começo** do objeto, e `onSuccess`/`onError` internos são declarados DEPOIS. Callbacks do caller são invocados via `options?.onSuccess?.(...args)` usando padrão rest/spread `(...args: any[])` para compatibilidade entre versões
- **Toasts de erro**: sempre usam `extractBackendMessage(err)` para exibir a mensagem real da API (lê formato `{ error: { code, message } }`)
- **Evento NÃO tem imagem**: desde a refatoração, os cards de evento e detalhe usam um hero com gradiente + ícone `Film` (lucide). Não existe `imageUrl`, `cover`, `banner` nem `DEFAULT_IMAGE` placeholder.
- **Mappers ressilientes a payloads mistos**: `normalizeMovie` / `normalizeHours` / `normalizeLocal` / `mapTicketEventInfo` em `viewMappers.ts` fazem fallback bidirecional entre campos novos (`movie.name`, `hours`, `local`) e legados (`title`, `time`, `venue`) — evita `Cannot read properties of undefined` quando o backend retorna versões antigas.
- **React Suspense**: Todas as rotas declaram `pendingComponent` e `errorComponent`/`CatchNotFound` no TanStack Router. Sem `if (isLoading)` ou `if (isError)` inline no JSX
- **EmptyState diferenciado**: na home, `EmptyState` mostra mensagem diferente quando é uma busca sem resultados vs. lista vazia da API
- **React Hook Form + Zod**: Todos os formulários usam `useForm` + `zodResolver` com `mode: 'onTouched'`
  - **CreateEventModal**: inputs nativos `<input type="date">` e `<input type="time">` (sem calendário Shadcn). Select de filmes integrado via `Controller` com `trigger('movie')` manual em `onValueChange` para validação imediata.
  - **Dialog do Radix** usa `modal={false}` para evitar conflitos de focus trap com Selects renderizados em Portal + `z-[200]` em Dropdowns quando necessário.
- **QrCodeScanner (gate.tsx)**: usa `@zxing/browser` (`decodeFromVideoDevice` + `IScannerControls`), detecta câmeras via `enumerateDevices()` + `devicechange` e esconde completamente a UI de câmera em hosts sem câmera, contexto inseguro ou API indisponível. Suporta lanterna (torch) quando o hardware permite.
- **Path aliases**: `#/*` e `@/*` ambos apontam para `./src/*`
- **Commit pattern**: [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) — `tipo(escopo): mensagem`

---

## 🛠️ Stack Tecnológica Completa

| Categoria | Tecnologia |
|---|---|
| **Framework Fullstack** | TanStack Start + Nitro (SSR / API runtime) |
| **UI / Linguagem** | React 19 + TypeScript 6 (strict mode) |
| **Roteamento** | TanStack React Router (file-based routing) |
| **Build** | Vite 8 + Rolldown |
| **Estilização** | Tailwind CSS v4 + tailwind-merge + CVA |
| **UI Kit base** | shadcn/ui (Radix UI primitives) |
| **Ícones** | Lucide React |
| **Estado server / cache** | TanStack React Query v5 (useSuspenseQuery) |
| **Formulários** | React Hook Form + @hookform/resolvers |
| **Validação** | Zod 4 |
| **HTTP Client** | Axios (singleton com config centralizada) |
| **QR Code (exibição)** | qrcode.react |
| **QR Code (leitura por câmera)** | @zxing/browser + @zxing/library |
| **Qualidade** | ESLint 9 + Prettier 3 |

---

## 🔒 Variáveis de Ambiente

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `VITE_API_URL` | ✅ Sim | — | Base URL da API REST de eventos e ingressos |

Adicione em um arquivo `.env` na raiz do projeto. A partir de TanStack Start, variáveis **apenas com prefixo `VITE_`** são expostas ao cliente.
