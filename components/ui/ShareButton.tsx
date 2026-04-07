'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

interface ShareButtonProps {
  href?: string
  label?: string
  icon?: ReactNode
  className?: string
}

export default function ShareButton({ href, label = 'Share', icon, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = !href
      ? window.location.href
      : href.startsWith('http') ? href : `${window.location.origin}${href}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-cabin-stone/30 bg-white px-4 py-1.5 text-sm font-inter font-medium text-cabin-stone hover:border-cabin-maroon/40 hover:text-cabin-maroon transition-colors duration-150 whitespace-nowrap${className ? ` ${className}` : ''}`}
    >
      {icon && !copied && icon}
      {copied ? 'Copied!' : label}
    </button>
  )
}
