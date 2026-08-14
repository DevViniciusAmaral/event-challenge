export type TicketStatus = 'valid' | 'used'

export interface TicketEventInfo {
  id: string
  title: string
  date: string
  time: string
  venue: string
}

export interface TicketSummary {
  id: string
  code: string
  eventId: string
  buyerName: string
  buyerEmail: string
  quantity: number
  totalPrice: number
  status: TicketStatus
}

export interface TicketDetail extends TicketSummary {
  event: TicketEventInfo
}

export interface PurchaseTicketRequest {
  buyerName: string
  buyerEmail: string
  quantity: number
}

export interface ValidateTicketResponse {
  valid: boolean
  message?: string
  ticket?: {
    id: string
    code: string
    buyerName: string
    event: {
      id: string
      title: string
    }
  }
}
