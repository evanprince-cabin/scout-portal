'use client'

import { useState } from 'react'
import EventCard from './EventCard'
import EmptyState from '@/components/ui/EmptyState'

const EVENT_TYPES = ['All', 'Webinar', 'In-Person', 'Workshop', 'Conference'] as const

interface Event {
  title: string
  slug: { current: string }
  date: string
  eventType: string
  location?: string
  registrationUrl?: string
  summary?: string
  featured?: boolean
}

interface Props {
  upcoming: Event[]
  past: Event[]
}

const IconCalendar = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export default function EventsClient({ upcoming, past }: Props) {
  const [activeType, setActiveType] = useState<string>('All')
  const [pastOpen, setPastOpen] = useState(false)

  const filterEvents = (events: Event[]) =>
    activeType === 'All' ? events : events.filter(e => e.eventType === activeType)

  const filteredUpcoming = filterEvents(upcoming)
  const filteredPast = filterEvents(past)

  return (
    <div className="space-y-8">
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
              <EventCard key={event.slug.current} event={event} />
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
                <EventCard key={event.slug.current} event={event} />
              ))
            ) : past.length === 0 ? (
              <EmptyState
                heading="No past events yet."
                subtext="Past events will appear here."
              />
            ) : (
              <EmptyState
                heading={`No past ${activeType} events.`}
                subtext="Try switching the filter to see more events."
              />
            )}
          </div>
        )}
      </section>
    </div>
  )
}
