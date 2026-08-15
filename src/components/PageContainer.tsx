import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '5xl' | '7xl'
}

const maxWidthMap: Record<string, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '5xl': 'max-w-5xl',
  '7xl': 'max-w-7xl',
}

export function PageContainer({
  children,
  className,
  maxWidth = '7xl',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 py-12 sm:px-6 lg:px-8',
        maxWidthMap[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  )
}
