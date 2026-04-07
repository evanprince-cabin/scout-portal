'use client'

import { ExternalLink } from 'lucide-react'
interface EventCardActionsProps {
  eventSlug: string
  registrationUrl?: string
}

export default function EventCardActions({ eventSlug, registrationUrl }: EventCardActionsProps) {
  return (
    <div
      className="relative z-10 flex flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0 items-center justify-end"
      onClick={(e) => e.stopPropagation()}
    >
{registrationUrl && (
        <button
          onClick={() => window.open(registrationUrl, '_blank', 'noopener,noreferrer')}
          className="inline-flex items-center justify-center gap-1 rounded-full px-4 py-1.5 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 whitespace-nowrap"
        >
          View on Meetup <ExternalLink size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
