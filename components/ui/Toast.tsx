'use client'

import { useEffect } from 'react'

type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type?: ToastType
  onDismiss: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-3
        px-5 py-4 rounded-2xl shadow-lg
        font-inter text-sm font-medium text-white
        animate-in slide-in-from-bottom-2 duration-200
        ${type === 'success' ? 'bg-cabin-maroon' : 'bg-cabin-flame'}
      `}
      role="alert"
    >
      {type === 'success' ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 9L7 13L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 5V9M9 13H9.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" />
        </svg>
      )}
      {message}
      <button
        onClick={onDismiss}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 3L3 11M3 3L11 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
