import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
}

export default function Button({ isLoading, children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-2xl bg-white text-brand-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Carregando…' : children}
    </button>
  )
}
