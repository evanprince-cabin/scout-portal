'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Send, BookMarked, Layers, Map } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onDismiss: () => void
}

const tiles = [
  {
    icon: Send,
    iconColor: 'text-cabin-charcoal',
    title: 'Send Referrals',
    description: 'Warm intros, tracked',
  },
  {
    icon: BookMarked,
    iconColor: 'text-cabin-charcoal',
    title: 'View Case Studies',
    description: 'Proof, in context',
  },
  {
    icon: Layers,
    iconColor: 'text-cabin-charcoal',
    title: 'Download Assets',
    description: 'Logos, decks, one-pagers',
  },
  {
    icon: Map,
    iconColor: 'text-cabin-charcoal',
    title: 'Learn the Playbook',
    description: 'How we pitch, together',
  },
]

export default function WelcomeModal({ isOpen, onDismiss }: WelcomeModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [slidingOut, setSlidingOut] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSlidingOut(false)
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleCta() {
    if (slidingOut) return
    setSlidingOut(true)
    // Fire API call in background — non-blocking
    fetch('/api/user/welcome', { method: 'PATCH' }).catch(() => {})
    // Dismiss after slide-down animation completes
    setTimeout(() => onDismiss(), 300)
  }

  if (!mounted) return null

  const panelClass = slidingOut
    ? 'opacity-0 translate-y-16'
    : visible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-95'

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ease-out bg-black/80 ${slidingOut ? 'opacity-0' : visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-xl w-full mx-4 p-8 flex flex-col transition-all duration-300 ease-out ${panelClass}`}
      >
        {/* Header row */}
        <div className="flex items-center gap-2 mb-6">
          <Image
            src="/cabin-symbol-black.png"
            alt="Cabin"
            width={20}
            height={20}
            className="object-contain"
          />
          <span className="font-geist font-bold text-cabin-charcoal text-base leading-none">
            Cabin
          </span>
          <span className="text-cabin-stone/40 mx-1 select-none">|</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-cabin-stone">
            Scout Portal
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-geist font-bold text-3xl text-cabin-charcoal mb-3 text-left">
          Welcome to your{' '}
          <span className="inline-block border-b-2 border-cabin-flame">scout</span>
          {' '}HQ.
        </h2>

        {/* Body copy */}
        <p className="font-inter text-base text-cabin-stone leading-relaxed mb-6 text-left">
          You were invited to the Cabin Scout program because you're someone people trust. We built this portal to give you everything you need in one place. It's a living resource, and we'll keep building it based on what you actually need. Here's what you can do in the portal:
        </p>

        {/* 2×2 tile grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          {tiles.map(({ icon: Icon, iconColor, title, description }) => (
            <div
              key={title}
              className="bg-cabin-linen rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="flex-shrink-0 bg-white rounded-xl p-2 shadow-sm">
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="font-inter font-semibold text-sm text-cabin-charcoal leading-tight">
                  {title}
                </p>
                <p className="font-inter text-xs text-cabin-stone mt-0.5 leading-snug">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleCta}
          disabled={slidingOut}
          className="mx-auto bg-cabin-maroon text-white font-inter font-semibold rounded-full px-10 py-3 hover:bg-[#8E5763] transition-colors duration-150 disabled:opacity-60"
        >
          Let's go →
        </button>
      </div>
    </div>,
    document.body
  )
}
