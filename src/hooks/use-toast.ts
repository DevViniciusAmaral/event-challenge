import * as React from 'react'

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

export interface ToastAction {
  altText: string
  label: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export interface ToastOptions {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastAction
  variant?: ToastVariant
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type ToasterToast = ToastOptions

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

interface ToastState {
  toasts: ToasterToast[]
}

const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(state: ToastState) {
  memoryState = state
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type ToastInput = Omit<ToasterToast, 'id'> & { id?: string }

function toast(props: ToastInput) {
  const id = props.id ?? genId()

  const onOpenChange = (open: boolean) => {
    if (!open) dismiss(id)
    props.onOpenChange?.(open)
  }

  dispatch({
    toasts: [...memoryState.toasts, { ...props, id, onOpenChange, open: true }],
  })

  const duration = props.duration ?? 5000
  if (duration !== Infinity) {
    setTimeout(() => dismiss(id), duration)
  }

  return {
    id,
    dismiss: () => dismiss(id),
    update: (next: Partial<ToastInput>) =>
      dispatch({
        toasts: memoryState.toasts.map((t) =>
          t.id === id ? { ...t, ...next, id } : t,
        ),
      }),
  }
}

function dismiss(id?: string) {
  dispatch({
    toasts: memoryState.toasts
      .map((t) =>
        id === undefined || t.id === id
          ? { ...t, open: false }
          : t,
      )
      .filter((t) => t.open !== false),
  })
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss,
  }
}

export { useToast, toast }
