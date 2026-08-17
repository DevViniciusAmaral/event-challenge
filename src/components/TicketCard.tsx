import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { TicketDetail } from '../domain/types/ticket.types'
import { formatDateTime } from '@/lib/utils'
import { mapTicketEventInfo } from '../utils/viewMappers'

interface TicketCardProps {
  ticket: TicketDetail
  showShareLink?: boolean
}

export function TicketCard({ ticket, showShareLink = false }: TicketCardProps) {
  const event = mapTicketEventInfo(ticket.event)
  const ticketCode = ticket.code || ticket.id
  const ticketUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tickets/${ticket.id}`
      : `/tickets/${ticket.id}`

  const [codeCopied, setCodeCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const handleCopyCode = async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(ticketCode)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 3000)
    } catch {
      // noop
    }
  }

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(ticketUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3000)
    } catch {
      // noop
    }
  }

  return (
    <div className="mx-auto max-w-md w-full">
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden relative shadow-sm">
        <div className="h-2 w-full bg-zinc-900" />

        <div className="p-6 space-y-6">
          <div className="text-center">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wider ${
                ticket.status === 'valid'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              Ingresso {ticket.status === 'valid' ? 'Válido' : 'Utilizado'}
            </span>
            <h2 className="mt-4 text-lg font-semibold text-zinc-950 line-clamp-2">
              {event.movie.name}
            </h2>
          </div>

          <div className="border-t border-dashed border-zinc-200" />

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium text-zinc-400">Data e Hora</p>
              <p className="mt-1 text-zinc-900 font-medium">
                {formatDateTime(event.date, event.hours)}
              </p>
            </div>
            <div>
              <p className="font-medium text-zinc-400">Local</p>
              <p className="mt-1 text-zinc-900 font-medium line-clamp-1">
                {event.local}
              </p>
            </div>
            <div>
              <p className="font-medium text-zinc-400">Titular</p>
              <p className="mt-1 text-zinc-900 font-medium truncate">
                {ticket.buyerName}
              </p>
            </div>
            <div>
              <p className="font-medium text-zinc-400">E-mail</p>
              <p className="mt-1 text-zinc-900 font-medium truncate">
                {ticket.buyerEmail}
              </p>
            </div>
            <div>
              <p className="font-medium text-zinc-400">Quantidade</p>
              <p className="mt-1 text-zinc-900 font-medium">
                {ticket.quantity}{' '}
                {ticket.quantity > 1 ? 'ingressos' : 'ingresso'}
              </p>
            </div>
            <div>
              <p className="font-medium text-zinc-400">Total Pago</p>
              <p className="mt-1 text-zinc-900 font-mono font-semibold">
                R$ {ticket.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-200" />

          <div className="space-y-4">
            <button
              onClick={handleCopyCode}
              className="w-full flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 transition-all hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            >
              <div className="text-left">
                <p className="text-3xs font-medium uppercase tracking-wider text-zinc-500">
                  Código do Ingresso
                </p>
                <p className="mt-0.5 text-sm font-mono tracking-wider font-semibold uppercase text-zinc-900">
                  {ticketCode}
                </p>
              </div>
              {codeCopied ? (
                <svg
                  className="h-5 w-5 text-emerald-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-zinc-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>

            <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 border border-zinc-100 rounded-md">
              <div className="h-44 w-44 bg-white border border-zinc-200 p-2 rounded flex items-center justify-center">
                <QRCodeSVG
                  value={ticketCode}
                  size={160}
                  level="M"
                  includeMargin={false}
                  fgColor="#09090b"
                />
              </div>
              <p className="mt-3 text-3xs text-zinc-400 font-mono tracking-widest text-center">
                APRESENTE O QR CODE NA PORTARIA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {showShareLink && (
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 rounded border border-zinc-200 bg-white py-3 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          >
            {linkCopied ? (
              <>
                <svg
                  className="h-4 w-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Link Copiado!</span>
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 10.742l8.162-4.081m0 0l-8.162-4.081m8.162 4.081l-8.162 4.081M4 12h.01M4 12a1 1 0 100-2 1 1 0 000 2zm0 0a1 1 0 110-2 1 1 0 010 2zm14-8a1 1 0 110-2 1 1 0 010 2zm0 0a1 1 0 100-2 1 1 0 000 2zm0 16a1 1 0 110-2 1 1 0 010 2zm0 0a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
                <span>Compartilhar via Link</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
