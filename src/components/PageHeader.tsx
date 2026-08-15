import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  align?: 'left' | 'center'
  withDivider?: boolean
}

export function PageHeader({
  title,
  description,
  children,
  className,
  align = 'left',
  withDivider = true,
}: PageHeaderProps) {
  const alignClass =
    align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-4',
        withDivider && 'border-b border-zinc-200 pb-8 mb-10',
        align === 'center' && 'sm:flex-col sm:items-center',
        'sm:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col', alignClass)}>
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-base text-zinc-500">{description}</p>
        )}
      </div>
      {children && (
        <div className={cn(align === 'center' && 'mt-2')}>{children}</div>
      )}
    </div>
  )
}
