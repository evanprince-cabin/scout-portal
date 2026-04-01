import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEventBySlug, getAllEvents } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import Badge from '@/components/ui/Badge'
import ShareButton from '@/components/ui/ShareButton'
import RichText from '@/components/content/RichText'

export const revalidate = 60

type BadgeVariant = 'webinar' | 'in-person' | 'workshop' | 'conference' | 'stone'
const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:      'webinar',
  'In-Person':  'in-person',
  Workshop:     'workshop',
  Conference:   'conference',
}

export async function generateStaticParams() {
  const data = await getAllEvents().catch(() => ({ upcoming: [], past: [] }))
  const all = [...(data?.upcoming ?? []), ...(data?.past ?? [])]
  return all.map((e: any) => ({ slug: e.slug.current }))
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug).catch(() => null)

  if (!event) notFound()

  const variant = eventTypeVariant[event.eventType] ?? 'stone'

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedTime = new Date(event.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  const endTime = event.endDate
    ? new Date(event.endDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : null

  const locationLabel =
    event.location && event.location.trim().toLowerCase() !== 'virtual'
      ? event.location
      : 'Virtual'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/events"
        className="inline-flex items-center text-sm font-inter font-medium text-cabin-maroon hover:text-cabin-charcoal transition-colors duration-150"
      >
        ← Back to Events
      </Link>

      {/* Cover image */}
      {event.coverImage && (
        <div className="w-full h-72 rounded-2xl overflow-hidden bg-cabin-linen">
          <img
            src={urlFor(event.coverImage)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div>
        <Badge variant={variant}>{event.eventType}</Badge>
        <h1 className="mt-3 font-geist font-bold text-4xl text-cabin-charcoal leading-tight">
          {event.title}
        </h1>

        {/* Info row */}
        <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm font-inter text-cabin-stone">
          <div className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.25" />
              <path d="M1 6H14" stroke="currentColor" strokeWidth="1.25" />
              <path d="M5 1V3M10 1V3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.25" />
              <path d="M7.5 4V8L10 9.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            {formattedTime}{endTime && ` – ${endTime}`}
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M7.5 1C5 1 3 3 3 5.5C3 8.5 7.5 14 7.5 14C7.5 14 12 8.5 12 5.5C12 3 10 1 7.5 1Z" stroke="currentColor" strokeWidth="1.25" />
              <circle cx="7.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
            </svg>
            {locationLabel}
          </div>
        </div>

        {event.summary && (
          <p className="mt-3 font-inter text-cabin-stone text-lg leading-relaxed">
            {event.summary}
          </p>
        )}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150"
          >
            Register for this Event →
          </a>
        )}
        <ShareButton label="Share this Event" />
      </div>

      {/* Body */}
      {event.body && (
        <div className="border-t border-cabin-mauve pt-8">
          <RichText value={event.body} />
        </div>
      )}
    </div>
  )
}
