'use client'

import { useToast } from '@/lib/toast'
import Button from './Button'

interface ShareButtonProps {
  /** Full URL or path (e.g. '/events/slug'). Omit to copy the current page URL. */
  href?: string
  label?: string
  className?: string
}

export default function ShareButton({ href, label = 'Share', className = '' }: ShareButtonProps) {
  const { showToast } = useToast()

  async function handleCopy() {
    const url = !href
      ? window.location.href
      : href.startsWith('http')
        ? href
        : `${window.location.origin}${href}`
    await navigator.clipboard.writeText(url)
    showToast('Link copied!')
  }

  return (
    <Button variant="ghost" onClick={handleCopy} className={className}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M8 1H3C2.448 1 2 1.448 2 2V10C2 10.552 2.448 11 3 11H9C9.552 11 10 10.552 10 10V5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 1V5H10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4.5 7.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.5 9.5H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {label}
    </Button>
  )
}
