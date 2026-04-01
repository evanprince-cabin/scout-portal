import { getAllEvents } from '@/lib/sanity/queries'
import EventsClient from '@/components/content/EventsClient'

export const revalidate = 60

export default async function EventsPage() {
  const data = await getAllEvents().catch(() => ({ upcoming: [], past: [] }))
  const upcoming = data?.upcoming ?? []
  const past = data?.past ?? []

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-geist font-bold text-3xl tracking-tight text-cabin-charcoal">Events</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Webinars, meetups, and conferences — bring your network to Cabin.
        </p>
      </div>
      <EventsClient upcoming={upcoming} past={past} />
    </div>
  )
}
