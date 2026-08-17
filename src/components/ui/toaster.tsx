import axios from 'axios'
import { toast as realToast, useToast  } from '@/hooks/use-toast'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
  
} from '@/components/ui/toast'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const variantIcon = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
} as const

const variantIconClass = {
  default: 'text-muted-foreground',
  destructive: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
} as const

export function extractBackendMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data?.error
    if (typeof d?.message === 'string' && d.message.trim()) return d.message
    if (typeof d?.error === 'string' && d.error.trim()) return d.error
    if (Array.isArray(d?.errors) && d.errors.length > 0) {
      const first = d.errors[0]
      if (typeof first === 'string') return first
      if (typeof first?.message === 'string' && first.message.trim())
        return first.message
    }
    if (typeof d?.detail === 'string' && d.detail.trim()) return d.detail
  }
  if (err instanceof Error && err.message && err.message.trim())
    return err.message
  return 'Ocorreu um erro ao processar sua solicitação.'
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const Icon = variantIcon[variant ?? 'default']
        return (
          <Toast
            key={id}
            variant={variant ?? 'default'}
            {...(props)}
          >
            <div className="flex gap-3">
              <Icon
                className={cn(
                  'mt-0.5 h-5 w-5 flex-shrink-0',
                  variantIconClass[variant ?? 'default'],
                )}
              />
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action?.label ? (
              <ToastAction altText={action.altText} onClick={action.onClick}>
                {action.label}
              </ToastAction>
            ) : null}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export function successToast(title: string, description?: string) {
  return realToast({
    title,
    description,
    variant: 'success',
    duration: 4000,
  })
}

export function errorToast(title: string, description?: string) {
  return realToast({
    title,
    description,
    variant: 'destructive',
    duration: 6000,
  })
}

export function warningToast(title: string, description?: string) {
  return realToast({
    title,
    description,
    variant: 'warning',
    duration: 5000,
  })
}

export function infoToast(title: string, description?: string) {
  return realToast({
    title,
    description,
    variant: 'info',
    duration: 4000,
  })
}

export function toastErrorFromApi(
  error: unknown,
  fallbackTitle = 'Erro na operação',
) {
  return errorToast(fallbackTitle, extractBackendMessage(error))
}
