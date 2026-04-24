'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import EventCardActions from '@/components/dashboard/EventCardActions'
import EventModal from '@/components/ui/EventModal'

type BadgeVariant = 'webinar' | 'in-person' | 'workshop' | 'conference' | 'stone'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:     'webinar',
  'In-Person': 'in-person',
  Workshop:    'workshop',
  Conference:  'conference',
}

interface DashboardEvent {
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  eventType: string
  location?: string
  registrationUrl?: string
  summary?: string
  coverImage?: object
}

interface DashboardEventsSectionProps {
  events: DashboardEvent[]
}

export default function DashboardEventsSection({ events }: DashboardEventsSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(null)

  return (
    <>
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => {
            const eventDate = new Date(event.date)
            const dayNum = eventDate.toLocaleDateString('en-US', { day: 'numeric' })
            const monthAbbr = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
            const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            const locationLabel =
              event.location &&
              event.location.trim().toLowerCase() !== 'virtual' &&
              event.location.trim() !== ''
                ? event.location
                : 'Virtual'
            const variant: BadgeVariant = eventTypeVariant[event.eventType] ?? 'stone'

            return (
              <div
                key={event.slug.current}
                className="relative overflow-hidden bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 flex flex-wrap gap-4 hover:border-cabin-stone/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 bg-[#E5EAFF] rounded-xl w-14 flex flex-col items-center justify-center py-3 px-2">
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
                    <p className="text-sm font-inter text-cabin-stone mb-1.5">{timeStr} · {locationLabel}</p>
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
          })}
        </div>
      ) : (
        <p className="font-inter text-cabin-stone text-sm">No upcoming events scheduled.</p>
      )}

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
    </>
  )
}
