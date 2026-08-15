'use client'

import { useState  } from 'react'
import type {ReactNode} from 'react';
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from './queryClient'

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
