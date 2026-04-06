'use client'

import { useState } from 'react'

interface ShareButtonProps {
  href?: string
  label?: string
}

export default function ShareButton({ href, label = 'Share' }: ShareButtonProps) {
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
      className="inline-flex items-center justify-center rounded-full border border-cabin-stone/30 px-4 py-1.5 text-xs font-inter font-medium text-cabin-stone hover:border-cabin-maroon/40 hover:text-cabin-maroon transition-colors duration-150 whitespace-nowrap"
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}
