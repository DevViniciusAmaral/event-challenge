# 🎟️ Plataforma de Eventos e Ingressos

Projeto fullstack de plataforma de eventos com três fluxos principais: **Organizador** (cria e publica eventos), **Cliente** (busca, reserva e compra ingressos) e **Portaria** (valida ingressos na entrada). Desenvolvido com **TanStack Start**, **React 19**, **Vite 8**, **Tailwind CSS v4** e **TypeScript strict mode**.

Escopo do desafio técnico e regras de avaliação em [CHALLENGE.md](file:///C:/Users/vinia/projects/event-challenge/CHALLENGE.md).

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) **>= 20 LTS** (recomendado 22+)
- Gerenciador de pacotes: `npm`, `pnpm`, `yarn` ou `bun` (bun.lock versionado no repo)
- Backend da API de eventos rodando (ver **Variáveis de Ambiente** abaixo)

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
| `/` | Home | Cliente | Lista eventos publicados com busca + filtro por tipo (Show/Cinema) |
| `/events/$id` | Detalhe do evento | Cliente | Tela com infos, capacidade e formulário de compra de ingresso |
| `/tickets/$id` | Ingresso | Cliente | Exibe ingresso com QR Code e dados da compra |
| `/organizer` | Dashboard | Organizador | Métricas, listagem de eventos criados, ações (publicar, excluir, criar novo) |
| `/gate` | Validação | Portaria | Valida ingresso por código ou ID (válido / já usado / não encontrado) |
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
│   ├── CreateEventModal.tsx # Modal criar + publicar evento (RHF + Zod)
│   ├── EmptyState.tsx       # Estado "nenhum resultado"
│   ├── ErrorState.tsx       # Error state + NotFoundState (404)
│   ├── EventCard.tsx        # Card de evento na home
│   ├── FormField.tsx        # FormInput / FormTextarea / FormSelect compartilhados
│   ├── LoadingState.tsx     # Skeleton loading padrão
│   ├── MetricCard.tsx       # Card de métrica do organizador
│   ├── PageContainer.tsx    # Wrapper padrão de página
│   ├── PageHeader.tsx       # Header com título + descrição + ações
│   ├── QuantitySelector.tsx # Botões +/- quantidade de ingressos
│   ├── SearchFilter.tsx     # Barra de busca + filtros tipo
│   ├── TicketCard.tsx       # Card com QR Code do ingresso
│   └── not-found.tsx        # Página 404 com redirecionamento automático
│
├── data/
│   ├── api/apiClient.ts     # Instância singleton do axios + interceptors
│   └── repositories/        # Repository pattern: 1 repo por agregado
│       ├── event.repository.ts
│       ├── organizer.repository.ts
│       └── ticket.repository.ts
│
├── domain/
│   ├── types/               # Tipos TypeScript de domínio (puros, sem import de lib)
│   │   ├── event.types.ts
│   │   ├── organizer.types.ts
│   │   └── ticket.types.ts
│   └── schemas/
│       └── event.schema.ts  # Schemas Zod de validação (criar evento, checkout)
│
├── presentation/
│   ├── hooks/               # Custom hooks com React Query
│   │   ├── useEvents.ts     # usePublishedEvents / useEventById / mutations
│   │   ├── useOrganizer.ts  # useOrganizerEvents / useOrganizerStats
│   │   └── useTickets.ts    # useTicketById / usePurchaseTicket / useValidateTicket
│   └── mappers/
│       └── viewMappers.ts   # DEFAULT_IMAGE + transform domain → View models
│
├── routes/                  # File-based routing do TanStack Router
│   ├── __root.tsx           # Root route (QueryClient, layout, defaultNotFound)
│   ├── index.tsx            # /
│   ├── events.$id.tsx       # /events/$id
│   ├── tickets.$id.tsx      # /tickets/$id
│   ├── organizer.tsx        # /organizer
│   └── gate.tsx             # /gate
│
├── lib/utils.ts             # cn(), formatPrice(), formatDate(), formatDateTime()
├── hooks/use-toast.ts       # Hook customizado do shadcn/toaster
├── router.tsx               # Criação do router singleton
└── styles.css               # Tailwind v4 imports + tema base
```

### Padrões e convenções

- **Repository pattern**: toda comunicação com API passa por `src/data/repositories/*` — componentes não chamam axios diretamente
- **Presentation hooks**: `useSuspenseQuery` + `useMutation` do TanStack Query com query keys centralizadas. Invalidação de cache sempre dispara `refetchType: 'all'`
- **React Suspense**: Todas as rotas declaram `pendingComponent` e `errorComponent`/`CatchNotFound` no TanStack Router. Sem `if (isLoading)` ou `if (isError)` inline no JSX
- **React Hook Form + Zod**: Todos os formulários (criar evento, comprar ingresso, etc.) usam `useForm` + `zodResolver`
- **Path aliases**: `#/*` e `@/*` ambos apontam para `./src/*` (configurado em `tsconfig.json` + `package.json#imports`)
- **Commit pattern**: [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) — `feat:`, `fix:`, `refactor:`, `chore:`, `docs:` etc.

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
| **QR Code** | qrcode.react |
| **Qualidade** | ESLint 9 + Prettier 3 |

---

## 🔒 Variáveis de Ambiente

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `VITE_API_URL` | ✅ Sim | — | Base URL da API REST de eventos e ingressos |

Adicione em um arquivo `.env` na raiz do projeto. A partir de TanStack Start, variáveis **apenas com prefixo `VITE_`** são expostas ao cliente.
