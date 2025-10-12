import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg bg-surface text-on-surface placeholder-on-surface/60 border border-primary/20 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${props.className ?? ''}`}
    />
  )
}
