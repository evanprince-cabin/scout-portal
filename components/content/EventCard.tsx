import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import ShareButton from '@/components/ui/ShareButton'

type BadgeVariant = 'maroon' | 'gold' | 'flame' | 'sky' | 'indigo' | 'stone' | 'grass'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:       'sky',
  'In-Person':   'grass',
  Workshop:      'gold',
  Conference:    'indigo',
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

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const locationLabel =
    location && location.trim().toLowerCase() !== 'virtual' && location.trim() !== ''
      ? location
      : 'Virtual'

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-cabin-stone/20 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={variant}>{eventType}</Badge>
            <span className="inline-flex items-center text-xs font-inter text-cabin-stone bg-cabin-mauve px-2.5 py-1 rounded-full">
              {locationLabel}
            </span>
          </div>
          <Link href={`/events/${slug.current}`}>
            <h3 className="font-geist font-semibold text-cabin-charcoal text-lg leading-snug mb-1 hover:text-cabin-maroon transition-colors duration-150">
              {title}
            </h3>
          </Link>
          <p className="text-sm font-inter text-cabin-stone mb-2">{formattedDate}</p>
          {summary && (
            <p className="text-sm font-inter text-cabin-stone line-clamp-2">{summary}</p>
          )}
        </div>
        <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 items-start">
          {registrationUrl && (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 whitespace-nowrap"
            >
              Register →
            </a>
          )}
          <ShareButton href={`/events/${slug.current}`} label="Share Event" />
        </div>
      </div>
    </div>
  )
}
