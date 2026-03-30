import Badge from '@/components/ui/Badge'

type BadgeVariant = 'maroon' | 'gold' | 'flame' | 'sky' | 'indigo' | 'stone' | 'grass'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:      'sky',
  'In-Person':  'grass',
  Workshop:     'gold',
  Conference:   'indigo',
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
  const { title, date, eventType, location, registrationUrl } = event
  const variant = eventTypeVariant[eventType] ?? 'stone'

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const locationLabel =
    location && location.trim().toLowerCase() !== 'virtual' && location.trim() !== ''
      ? location
      : 'Virtual'

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex-1 min-w-0">
        <Badge variant={variant}>{eventType}</Badge>
        <h3 className="mt-2 font-geist font-semibold text-cabin-charcoal text-base leading-snug">
          {title}
        </h3>
        <p className="mt-1 text-sm font-inter text-cabin-stone">
          {formattedDate} · {locationLabel}
        </p>
      </div>
      {registrationUrl && (
        <a
          href={registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 flex-shrink-0 self-start sm:self-center"
        >
          Register →
        </a>
      )}
    </div>
  )
}
