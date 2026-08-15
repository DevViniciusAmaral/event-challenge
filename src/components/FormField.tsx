import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  labelClass?: string
}

export function FormInput({
  label,
  error,
  className,
  id,
  labelClass,
  ...rest
}: FormInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label
        htmlFor={inputId}
        className={cn(
          'block text-xs font-medium text-zinc-500 mb-1.5',
          labelClass,
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500',
          error &&
            'border-destructive focus:border-destructive focus:ring-destructive',
          className,
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function FormTextarea({
  label,
  error,
  className,
  id,
  ...rest
}: FormTextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-xs font-medium text-zinc-500 mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-500',
          error &&
            'border-destructive focus:border-destructive focus:ring-destructive',
          className,
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export function FormSelect({
  label,
  error,
  className,
  id,
  children,
  ...rest
}: FormSelectProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-xs font-medium text-zinc-500 mb-1.5"
      >
        {label}
      </label>
      <select
        id={inputId}
        className={cn(
          'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
