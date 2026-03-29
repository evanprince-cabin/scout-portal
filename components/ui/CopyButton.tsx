'use client'

import { useState } from 'react'
import Button from './Button'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export default function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" onClick={handleCopy} className={className}>
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 10V2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {label}
        </>
      )}
    </Button>
  )
}
