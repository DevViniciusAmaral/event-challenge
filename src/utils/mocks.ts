export interface CatalogItem {
  id: string
  title: string
  type: 'movie' | 'show'
  artistOrDirector: string
  durationOrYear: string
  coverImage: string
  description: string
}

export interface EventItem {
  id: string
  catalogId: string
  title: string
  description: string
  date: string
  time: string
  location: string
  address: string
  price: number
  capacity: number
  available: number
  image: string
  type: 'movie' | 'show'
}

export interface TicketItem {
  id: string
  eventId: string
  buyerName: string
  buyerEmail: string
  buyerCpf: string
  qty: number
  totalPrice: number
  purchaseDate: string
  status: 'valid' | 'used'
}

// 🍿 Catalog of External Movies/Shows
export const mockCatalog: CatalogItem[] = [
  {
    id: 'cat-1',
    title: 'Interstellar - Cine Orquestra',
    type: 'show',
    artistOrDirector: 'Orquestra Sinfônica Municipal',
    durationOrYear: '140 min',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    description: 'A clássica trilha sonora de Hans Zimmer tocada ao vivo junto com a projeção em alta definição do clássico de ficção científica.',
  },
  {
    id: 'cat-2',
    title: 'Caetano & Maria Bethânia - Tour 2026',
    type: 'show',
    artistOrDirector: 'Caetano Veloso e Maria Bethânia',
    durationOrYear: '120 min',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
    description: 'O encontro histórico de dois dos maiores nomes da música popular brasileira em um show inesquecível repleto de clássicos.',
  },
  {
    id: 'cat-3',
    title: 'Dune: Part Two (Exibição IMAX)',
    type: 'movie',
    artistOrDirector: 'Denis Villeneuve',
    durationOrYear: '166 min',
    coverImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    description: 'A jornada mítica de Paul Atreides continua na experiência visual definitiva do cinema contemporâneo.',
  },
  {
    id: 'cat-4',
    title: 'Jazz at the Park',
    type: 'show',
    artistOrDirector: 'Standard Trio & Guests',
    durationOrYear: '180 min',
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80',
    description: 'Uma noite agradável sob as estrelas ao som dos maiores clássicos do Jazz tradicional e contemporâneo.',
  },
  {
    id: 'cat-5',
    title: 'Pulp Fiction (30th Anniversary Screening)',
    type: 'movie',
    artistOrDirector: 'Quentin Tarantino',
    durationOrYear: '154 min',
    coverImage: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
    description: 'Sessão especial remasterizada do aclamado clássico cult dos anos 90 que revolucionou o cinema independente.',
  },
]

// 📅 Initial Events Published
const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    catalogId: 'cat-1',
    title: 'Interstellar - Cine Orquestra no Teatro Municipal',
    description: 'Prepare-se para uma viagem espacial imersiva. A trilha sonora composta por Hans Zimmer executada ao vivo pela Orquestra Sinfônica Municipal de São Paulo sincronizada com o filme.',
    date: '2026-09-12',
    time: '20:00',
    location: 'Teatro Municipal',
    address: 'Praça Ramos de Azevedo, s/n - República, São Paulo - SP',
    price: 180,
    capacity: 500,
    available: 142,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    type: 'show',
  },
  {
    id: 'evt-2',
    catalogId: 'cat-2',
    title: 'Caetano & Maria Bethânia - Allianz Parque',
    description: 'O show mais aguardado da década. Irmãos Veloso se unem para um show emocionante que celebra a união de suas carreiras no palco.',
    date: '2026-10-05',
    time: '21:30',
    location: 'Allianz Parque',
    address: 'Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP',
    price: 250,
    capacity: 25000,
    available: 12450,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
    type: 'show',
  },
  {
    id: 'evt-3',
    catalogId: 'cat-3',
    title: 'Dune: Part Two (Exibição IMAX Especial)',
    description: 'Assista a obra-prima de Denis Villeneuve na maior tela IMAX do país com sistema de som totalmente imersivo 12.1.',
    date: '2026-08-28',
    time: '19:00',
    location: 'Espaço Itaú de Cinema - Pompéia',
    address: 'Rua Palestra Itália, 500 - Perdizes, São Paulo - SP',
    price: 45,
    capacity: 350,
    available: 12,
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
    type: 'movie',
  },
  {
    id: 'evt-4',
    catalogId: 'cat-4',
    title: 'Jazz at the Park - Jardim Botânico',
    description: 'Traga sua toalha de piquenique e curta uma tarde com o melhor do Jazz moderno. Área de alimentação com food trucks locais e vinhos artesanais.',
    date: '2026-09-20',
    time: '16:00',
    location: 'Jardim Botânico',
    address: 'Av. Miguel Estéfno, 3687 - Vila Água Funda, São Paulo - SP',
    price: 0,
    capacity: 1000,
    available: 489,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&auto=format&fit=crop&q=80',
    type: 'show',
  },
]

// 🎟️ Initial Tickets Mocked
const initialTickets: TicketItem[] = [
  {
    id: 'tkt-7193',
    eventId: 'evt-1',
    buyerName: 'Vinicius Amaral',
    buyerEmail: 'vinicius.amaral@exemplo.com',
    buyerCpf: '123.456.789-00',
    qty: 2,
    totalPrice: 360,
    purchaseDate: '2026-08-14T09:30:00Z',
    status: 'valid',
  },
  {
    id: 'tkt-8821',
    eventId: 'evt-3',
    buyerName: 'Ana Clara Souza',
    buyerEmail: 'ana.souza@exemplo.com',
    buyerCpf: '987.654.321-11',
    qty: 1,
    totalPrice: 45,
    purchaseDate: '2026-08-13T18:15:00Z',
    status: 'used',
  },
]

// Helper function to safely read/write to localStorage in the client
const isClient = typeof window !== 'undefined'

const getStoredData = <T>(key: string, initial: T): T => {
  if (!isClient) return initial
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : initial
}

const setStoredData = <T>(key: string, data: T): void => {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// State management for session
export const getEvents = (): EventItem[] => getStoredData('ec_events', initialEvents)
export const setEvents = (events: EventItem[]) => setStoredData('ec_events', events)

export const getTickets = (): TicketItem[] => getStoredData('ec_tickets', initialTickets)
export const setTickets = (tickets: TicketItem[]) => setStoredData('ec_tickets', tickets)

export const addEvent = (event: Omit<EventItem, 'id' | 'available'>) => {
  const events = getEvents()
  const newEvent: EventItem = {
    ...event,
    id: `evt-${events.length + 1}-${Math.floor(Math.random() * 1000)}`,
    available: event.capacity,
  }
  setEvents([newEvent, ...events])
  return newEvent
}

export const addTicket = (ticket: Omit<TicketItem, 'id' | 'purchaseDate' | 'status'>) => {
  const tickets = getTickets()
  const newTicket: TicketItem = {
    ...ticket,
    id: `tkt-${Math.floor(1000 + Math.random() * 9000)}`,
    purchaseDate: new Date().toISOString(),
    status: 'valid',
  }
  setTickets([newTicket, ...tickets])

  // update event availability
  const events = getEvents()
  const updatedEvents = events.map(evt => {
    if (evt.id === ticket.eventId) {
      return { ...evt, available: Math.max(0, evt.available - ticket.qty) }
    }
    return evt
  })
  setEvents(updatedEvents)

  return newTicket
}

export const getStats = () => {
  const events = getEvents()
  const tickets = getTickets()
  
  const totalRevenue = tickets.reduce((acc, t) => acc + t.totalPrice, 0)
  const ticketsSold = tickets.reduce((acc, t) => acc + t.qty, 0)

  return {
    totalEvents: events.length,
    ticketsSold,
    totalRevenue,
    recentSales: tickets.slice(0, 5),
  }
}
