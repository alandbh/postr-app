import React from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  isLoading?: boolean
}

const baseClasses = 'h-12 px-8 py-3 rounded-lg inline-flex items-center justify-center font-semibold leading-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-primary/30'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white/80 hover:bg-primary/90 active:bg-primary/80',
  outline: 'border border-primary/30 text-primary/50 hover:border-primary/50 hover:text-primary/70 active:bg-primary/5',
  ghost: 'text-on-surface/50 hover:text-on-surface/70 hover:bg-on-surface/5 active:bg-on-surface/10',
}

export default function Button({ variant = 'primary', isLoading, children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? 'Carregando…' : children}
    </button>
  )
}
