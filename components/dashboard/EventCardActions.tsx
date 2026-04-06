'use client'

import ShareButton from '@/components/ui/ShareButton'

interface EventCardActionsProps {
  eventSlug: string
  registrationUrl?: string
}

export default function EventCardActions({ eventSlug, registrationUrl }: EventCardActionsProps) {
  return (
    <div
      className="relative z-10 flex flex-col gap-2 flex-shrink-0 items-end justify-start"
      onClick={(e) => e.stopPropagation()}
    >
      <ShareButton href={`/events/${eventSlug}`} label="Share Event" />
      {registrationUrl && (
        <button
          onClick={() => window.open(registrationUrl, '_blank', 'noopener,noreferrer')}
          className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 whitespace-nowrap"
        >
          RSVP →
        </button>
      )}
    </div>
  )
}
