import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
}

export default function Button({ isLoading, children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Carregando…' : children}
    </button>
  )
}
