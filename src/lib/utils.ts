import { clsx  } from 'clsx'
import type {ClassValue} from 'clsx';
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2)}`
}

export function formatDate(dateStr: string): string {
  return dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : ''
}

export function formatDateTime(dateStr: string, time: string): string {
  const d = formatDate(dateStr)
  return d ? `${d} às ${time}` : ''
}
