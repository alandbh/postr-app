import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-white/30 placeholder-white/40 ${props.className ?? ''}`}
    />
  )
}
