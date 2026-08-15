import { Link  } from '@tanstack/react-router'
import type {LinkProps} from '@tanstack/react-router';
import { cn } from '@/lib/utils'

interface BackLinkProps extends Omit<LinkProps, 'to'> {
  to: string
  label: string
  className?: string
}

export function BackLink({ to, label, className, ...rest }: BackLinkProps) {
  return (
    <Link
      to={to as any}
      className={cn(
        'inline-flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors',
        className,
      )}
      {...rest}
    >
      <svg
        className="mr-1.5 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </Link>
  )
}
