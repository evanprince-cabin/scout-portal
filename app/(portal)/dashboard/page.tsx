import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import { BookOpen, PlayCircle } from 'lucide-react'
import { getDashboardData } from '@/lib/sanity/queries'
import { getReferralStats } from '@/lib/supabase/referrals'
import { getFavoritesWithDefaults } from '@/lib/supabase/favorites'
import Badge from '@/components/ui/Badge'
import EventCardActions from '@/components/dashboard/EventCardActions'
import QuickActions from '@/components/dashboard/QuickActions'
import FavoritesSection from '@/components/dashboard/FavoritesSection'

export const dynamic = 'force-dynamic'

type BadgeVariant = 'strategy' | 'engineering' | 'design' | 'ai' | 'salesforce' | 'webinar' | 'in-person' | 'workshop' | 'conference' | 'stone'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:     'webinar',
  'In-Person': 'in-person',
  Workshop:    'workshop',
  Conference:  'conference',
}

const activityDot: Record<string, string> = {
  report:       'bg-cabin-indigo',
  article:      'bg-emerald-400',
  playbookPage: 'bg-purple-400',
  asset:        'bg-amber-400',
  event:        'bg-amber-400',
}

const activityLabel: Record<string, string> = {
  report:       'Report',
  article:      'Article',
  playbookPage: 'Playbook',
  asset:        'Asset',
  event:        'Event',
}

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName ?? 'Scout'

  const [_stats, dashboardData, initialFavorites] = await Promise.all([
    user?.id
      ? getReferralStats(user.id).catch(() => ({ submitted: 0, active: 0, closedWon: 0 }))
      : Promise.resolve({ submitted: 0, active: 0, closedWon: 0 }),
    getDashboardData().catch(() => ({
      latestReport: null,
      upcomingEvents: [],
      activityFeed: { reports: [], articles: [], playbookPages: [], assets: [], events: [] },
    })),
    user?.id
      ? getFavoritesWithDefaults(user.id).catch(() => [])
      : Promise.resolve([]),
  ])

  const latestReport = dashboardData?.latestReport ?? null
  const upcomingEvents = dashboardData?.upcomingEvents ?? []
  const rawFeed = dashboardData?.activityFeed ?? {}

  const allActivity = [
    ...(rawFeed.reports ?? []),
    ...(rawFeed.articles ?? []),
    ...(rawFeed.playbookPages ?? []),
    ...(rawFeed.assets ?? []),
    ...(rawFeed.events ?? []),
  ]
    .sort((a: any, b: any) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-8 page-enter">

      {/* Header */}
      <div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-cabin-stone">
            Field Status • Q1 2026
          </span>
        </div>
        <div className="inline-block mt-4">
          <h1 className="font-geist font-bold text-4xl lg:text-5xl tracking-tight text-cabin-charcoal">
            Welcome back {firstName}.
          </h1>
          <div className="border-b-2 border-cabin-flame mt-1 mb-8" />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions latestReportSlug={latestReport?.slug?.current ?? null} />

      {/* Favorites */}
      <FavoritesSection initialFavorites={initialFavorites} scoutId={user?.id ?? ''} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left column — lg:col-span-2 */}
        <div className="xl:col-span-2 space-y-8">

          {/* Upcoming Events */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-cabin-stone">
                Upcoming Events
              </h2>
              <Link
                href="/events"
                className="font-inter text-xs font-semibold uppercase tracking-widest text-cabin-maroon hover:text-cabin-charcoal transition-colors"
              >
                View all events →
              </Link>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event: any) => {
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
                    <div key={event.slug.current} className="relative overflow-hidden bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 flex flex-wrap gap-4 hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                      <Link href={`/events/${event.slug.current}`} className="absolute inset-0 z-0" aria-label={event.title} />

                      {/* Date block + Event details — always side by side */}
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

                      {/* Actions */}
                      <EventCardActions
                        eventSlug={event.slug.current}
                        registrationUrl={event.registrationUrl}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="font-inter text-cabin-stone text-sm">No upcoming events scheduled.</p>
            )}
          </section>

          {/* Activity Feed */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cabin-stone mb-4">
              Activity Feed
            </h2>
            <div className="bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-4">
              {allActivity.length > 0 ? (
                <div>
                  {allActivity.map((item: any, index: number) => {
                    const isLast = index === allActivity.length - 1
                    const href =
                      item.contentType === 'report'       ? `/reports/${item.slug?.current}` :
                      item.contentType === 'article'      ? `/articles/${item.slug?.current}` :
                      item.contentType === 'playbookPage' ? `/playbook/${item.slug?.current}` :
                      item.contentType === 'event'        ? `/events/${item.slug?.current}` :
                      '/assets'
                    return (
                      <Link
                        key={`${item.contentType}-${item._createdAt}`}
                        href={href}
                        className={`flex items-start gap-3 py-4 px-4 hover:bg-cabin-mauve/30 rounded-xl transition-colors duration-150 ${!isLast ? 'border-b border-cabin-stone/10' : ''}`}
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${activityDot[item.contentType] ?? 'bg-cabin-stone'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-widest text-cabin-stone mb-0.5">
                            {activityLabel[item.contentType] ?? item.contentType}
                          </p>
                          <p className="font-inter text-base font-semibold text-cabin-charcoal leading-snug">
                            {item.title}
                          </p>
                          <p className="text-xs font-inter text-cabin-stone mt-0.5">
                            Added • {new Date(item._createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="font-inter text-cabin-stone text-sm">No recent activity.</p>
              )}
            </div>
          </section>

        </div>

        {/* Right column — lg:col-span-1 */}
        <div className="xl:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-cabin-stone mb-4">
            Dive Deeper
          </p>
          <div className="space-y-3">
            <a
              href="https://www.youtube.com/@cabinco"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden group bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-5 flex items-start gap-4 hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #d1cdc7 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: '#f9f7f5' }}
              />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <PlayCircle size={20} className="text-cabin-stone" />
                </div>
                <div>
                  <p className="font-geist font-semibold text-cabin-charcoal text-base">Recorded Tech Talks</p>
                  <p className="mt-0.5 font-inter text-cabin-stone text-xs leading-relaxed">
                    Watch previous tech talks on our Youtube channel.
                  </p>
                </div>
              </div>
            </a>

            <Link
              href="/playbook"
              className="relative overflow-hidden group bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-5 flex items-start gap-4 hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #d1cdc7 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: '#f9f7f5' }}
              />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <BookOpen size={20} className="text-cabin-stone" />
                </div>
                <div>
                  <p className="font-geist font-semibold text-cabin-charcoal text-base">Study the Playbook</p>
                  <p className="mt-0.5 font-inter text-cabin-stone text-xs leading-relaxed">
                    Learn how to be the best advocate for Cabin to your network.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}
