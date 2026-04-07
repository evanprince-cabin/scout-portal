'use client'

import { useEffect, useState } from 'react'
import { getAllEvents } from '@/lib/sanity/queries'
import Badge from '@/components/ui/Badge'
import EventCardActions from '@/components/dashboard/EventCardActions'
import EmptyState from '@/components/ui/EmptyState'
import EventModal from '@/components/ui/EventModal'

const EVENT_TYPES = ['All', 'Webinar', 'In-Person', 'Workshop', 'Conference'] as const

type BadgeVariant = 'webinar' | 'in-person' | 'workshop' | 'conference' | 'stone'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:     'webinar',
  'In-Person': 'in-person',
  Workshop:    'workshop',
  Conference:  'conference',
}

interface Event {
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  eventType: string
  location?: string
  registrationUrl?: string
  coverImage?: object
  summary?: string
  featured?: boolean
}

const IconCalendar = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

function EventCardInline({ event, onClick }: { event: Event; onClick: () => void }) {
  const variant = eventTypeVariant[event.eventType] ?? 'stone'
  const dateObj = new Date(event.date)
  const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric' })
  const monthAbbr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const locationLabel =
    event.location && event.location.trim().toLowerCase() !== 'virtual' && event.location.trim() !== ''
      ? event.location
      : 'Virtual'

  return (
    <div
      className="relative overflow-hidden bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 flex flex-wrap gap-4 hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer max-w-7xl"
      onClick={onClick}
    >
      <div className="flex gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 bg-cabin-mauve rounded-xl w-14 flex flex-col items-center justify-center py-3 px-2">
          <span className="font-geist font-bold text-2xl text-cabin-charcoal leading-none">{dayNum}</span>
          <span className="font-inter text-xs font-semibold text-cabin-stone mt-0.5">{monthAbbr}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant={variant}>{event.eventType}</Badge>
            <span className="inline-flex items-center text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {locationLabel}
            </span>
          </div>
          <h3 className="font-geist font-semibold text-cabin-charcoal text-base leading-snug mb-1">
            {event.title}
          </h3>
          <p className="text-xs font-inter text-cabin-stone mb-1.5">{timeStr} · {locationLabel}</p>
          {event.summary && (
            <p className="text-sm font-inter text-cabin-stone line-clamp-2">{event.summary}</p>
          )}
        </div>
      </div>

      <div onClick={e => e.stopPropagation()}>
        <EventCardActions
          eventSlug={event.slug.current}
          registrationUrl={event.registrationUrl}
        />
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [upcoming, setUpcoming] = useState<Event[]>([])
  const [past, setPast] = useState<Event[]>([])
  const [activeType, setActiveType] = useState<string>('All')
  const [pastOpen, setPastOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    getAllEvents().then((data: any) => {
      setUpcoming(data?.upcoming ?? [])
      setPast(data?.past ?? [])
    })
  }, [])

  const filterEvents = (events: Event[]) =>
    activeType === 'All' ? events : events.filter(e => e.eventType === activeType)

  const filteredUpcoming = filterEvents(upcoming)
  const filteredPast = filterEvents(past)

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-geist font-bold text-3xl tracking-tight text-cabin-charcoal">Events</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Webinars, meetups, and conferences — bring your network to Cabin.
        </p>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-full text-sm font-inter font-medium transition-colors duration-150 ${
              activeType === type
                ? 'bg-cabin-maroon text-white'
                : 'bg-white text-cabin-stone border border-cabin-stone/30 hover:border-cabin-maroon hover:text-cabin-maroon'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Upcoming events */}
      <section>
        <h2 className="font-inter font-semibold text-sm uppercase tracking-widest text-cabin-stone mb-4">
          Upcoming Events
        </h2>
        {filteredUpcoming.length > 0 ? (
          <div className="space-y-4">
            {filteredUpcoming.map(event => (
              <EventCardInline
                key={event.slug.current}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<IconCalendar />}
            heading="No events on the calendar yet. Stay tuned."
            subtext={activeType !== 'All' ? `No upcoming ${activeType} events right now.` : undefined}
          />
        )}
      </section>

      {/* Past events toggle */}
      <section>
        <button
          onClick={() => setPastOpen(prev => !prev)}
          className="flex items-center gap-2 font-inter font-semibold text-sm uppercase tracking-widest text-cabin-stone hover:text-cabin-maroon transition-colors duration-150"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className={`transition-transform duration-200 ${pastOpen ? 'rotate-180' : ''}`}
          >
            <path d="M4 6L9 11L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Past Events
          {past.length > 0 && (
            <span className="text-sm font-inter font-normal text-cabin-stone">({past.length})</span>
          )}
        </button>

        {pastOpen && (
          <div className="mt-4 space-y-4">
            {filteredPast.length > 0 ? (
              filteredPast.map(event => (
                <EventCardInline
                  key={event.slug.current}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))
            ) : past.length === 0 ? (
              <EmptyState heading="No past events yet." subtext="Past events will appear here." />
            ) : (
              <EmptyState
                heading={`No past ${activeType} events.`}
                subtext="Try switching the filter to see more events."
              />
            )}
          </div>
        )}
      </section>

      {selectedEvent && (
        <EventModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          slug={selectedEvent.slug.current}
          eventType={selectedEvent.eventType}
          date={selectedEvent.date}
          endDate={selectedEvent.endDate}
          location={selectedEvent.location}
          summary={selectedEvent.summary}
          coverImage={selectedEvent.coverImage}
          registrationUrl={selectedEvent.registrationUrl}
        />
      )}
    </div>
  )
}
