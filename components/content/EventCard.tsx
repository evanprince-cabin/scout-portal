import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import EventCardActions from '@/components/dashboard/EventCardActions'

type BadgeVariant = 'webinar' | 'in-person' | 'workshop' | 'conference' | 'stone'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:       'webinar',
  'In-Person':   'in-person',
  Workshop:      'workshop',
  Conference:    'conference',
}

interface Event {
  title: string
  slug: { current: string }
  date: string
  eventType: string
  location?: string
  registrationUrl?: string
  summary?: string
}

export default function EventCard({ event }: { event: Event }) {
  const { title, slug, date, eventType, location, registrationUrl, summary } = event
  const variant = eventTypeVariant[eventType] ?? 'stone'

  const dateObj = new Date(date)
  const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric' })
  const monthAbbr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const locationLabel =
    location && location.trim().toLowerCase() !== 'virtual' && location.trim() !== ''
      ? location
      : 'Virtual'

  return (
    <div className="relative overflow-hidden bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 flex flex-wrap gap-4 hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer max-w-7xl">
      <Link href={`/events/${slug.current}`} className="absolute inset-0 z-0" aria-label={title} />

      {/* Date block + Event details */}
      <div className="flex gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 bg-[#E5EAFF] rounded-xl w-14 flex flex-col items-center justify-center py-3 px-2">
          <span className="font-geist font-bold text-2xl text-cabin-charcoal leading-none">{dayNum}</span>
          <span className="font-inter text-xs font-semibold text-cabin-stone mt-0.5">{monthAbbr}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant={variant}>{eventType}</Badge>
            <span className="inline-flex items-center text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {locationLabel}
            </span>
          </div>
          <h3 className="font-geist font-semibold text-cabin-charcoal text-base leading-snug mb-1">
            {title}
          </h3>
          <p className="text-xs font-inter text-cabin-stone mb-1.5">{timeStr} · {locationLabel}</p>
          {summary && (
            <p className="text-sm font-inter text-cabin-stone line-clamp-2">{summary}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <EventCardActions
        eventSlug={slug.current}
        registrationUrl={registrationUrl}
      />
    </div>
  )
}
