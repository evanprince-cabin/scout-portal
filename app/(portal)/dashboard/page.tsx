import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import { FileText, Send, Download } from 'lucide-react'
import { getDashboardData } from '@/lib/sanity/queries'
import { getReferralStats } from '@/lib/supabase/referrals'
import { urlFor } from '@/lib/sanity/image'
import Badge from '@/components/ui/Badge'
import ShareButton from '@/components/ui/ShareButton'

export const dynamic = 'force-dynamic'

type BadgeVariant = 'strategy' | 'engineering' | 'design' | 'ai' | 'salesforce' | 'webinar' | 'in-person' | 'workshop' | 'conference' | 'stone'

const eventTypeVariant: Record<string, BadgeVariant> = {
  Webinar:     'webinar',
  'In-Person': 'in-person',
  Workshop:    'workshop',
  Conference:  'conference',
}

const categoryVariant: Record<string, BadgeVariant> = {
  Strategy:    'strategy',
  Engineering: 'engineering',
  Design:      'design',
  AI:          'ai',
  Salesforce:  'salesforce',
}

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName ?? 'Scout'

  const [_stats, dashboardData] = await Promise.all([
    user?.id
      ? getReferralStats(user.id).catch(() => ({ submitted: 0, active: 0, closedWon: 0 }))
      : Promise.resolve({ submitted: 0, active: 0, closedWon: 0 }),
    getDashboardData().catch(() => ({
      latestReport: null,
      recentArticles: [],
      upcomingEvents: [],
    })),
  ])

  const recentArticles = dashboardData?.recentArticles ?? []
  const upcomingEvents = dashboardData?.upcomingEvents ?? []
  const featuredEvent = upcomingEvents[0] ?? null

  // Pre-compute event display values
  const eventVariant: BadgeVariant = featuredEvent
    ? (eventTypeVariant[featuredEvent.eventType] ?? 'stone')
    : 'stone'
  const eventLocationLabel = featuredEvent
    ? (featuredEvent.location &&
        featuredEvent.location.trim().toLowerCase() !== 'virtual' &&
        featuredEvent.location.trim() !== ''
          ? featuredEvent.location
          : 'Virtual')
    : ''
  const eventFormattedDate = featuredEvent
    ? new Date(featuredEvent.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <div className="space-y-8 page-enter">

        {/* Header */}
        <div>
          <h1 className="font-geist font-bold text-5xl tracking-tight text-cabin-charcoal">
            Hey {firstName} 👋
          </h1>
          <p className="mt-2 font-inter text-cabin-stone text-base">
            Here&apos;s what&apos;s happening at Cabin.
          </p>
        </div>

        <div className="space-y-10">

          {/* Quick Actions */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* View Latest Report */}
              <Link
                href="/reports"
                className="quick-action-card bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 hover:shadow-md hover:border-cabin-stone/40 transition-all duration-150 flex flex-row items-center gap-4"
              >
                <div className="inline-flex items-center justify-center bg-cabin-sky/20 p-3 rounded-xl flex-shrink-0">
                  <FileText size={24} className="text-cabin-indigo" />
                </div>
                <div>
                  <p className="font-geist font-semibold text-cabin-charcoal text-base">
                    View Latest Report
                  </p>
                  <p className="mt-0.5 font-inter text-cabin-stone text-sm">
                    Read the most recent scout report
                  </p>
                </div>
              </Link>

              {/* Send a Referral */}
              <Link
                href="/referrals"
                className="quick-action-card bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 hover:shadow-md hover:border-cabin-stone/40 transition-all duration-150 flex flex-row items-center gap-4"
              >
                <div className="inline-flex items-center justify-center bg-cabin-flame/10 p-3 rounded-xl flex-shrink-0">
                  <Send size={24} className="text-cabin-flame" />
                </div>
                <div>
                  <p className="font-geist font-semibold text-cabin-charcoal text-base">
                    Send a Referral
                  </p>
                  <p className="mt-0.5 font-inter text-cabin-stone text-sm">
                    Submit a new referral to the sales team
                  </p>
                </div>
              </Link>

              {/* Download an Asset */}
              <Link
                href="/assets"
                className="quick-action-card bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 hover:shadow-md hover:border-cabin-stone/40 transition-all duration-150 flex flex-row items-center gap-4"
              >
                <div className="inline-flex items-center justify-center bg-cabin-gold/20 p-3 rounded-xl flex-shrink-0">
                  <Download size={24} style={{ color: '#B8860B' }} />
                </div>
                <div>
                  <p className="font-geist font-semibold text-cabin-charcoal text-base">
                    Download an Asset
                  </p>
                  <p className="mt-0.5 font-inter text-cabin-stone text-sm">
                    Browse and download sales materials
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-inter font-semibold text-sm uppercase tracking-widest text-cabin-stone">
                Upcoming Events
              </h2>
              <Link
                href="/events"
                className="font-inter text-xs font-semibold uppercase tracking-widest text-cabin-maroon hover:text-cabin-charcoal transition-colors"
              >
                View all events →
              </Link>
            </div>

            {featuredEvent ? (
              <div className="bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={eventVariant}>{featuredEvent.eventType}</Badge>
                      <span className="inline-flex items-center text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                        {eventLocationLabel}
                      </span>
                    </div>
                    <Link href={`/events/${featuredEvent.slug.current}`}>
                      <h3 className="font-geist font-semibold text-cabin-charcoal text-lg leading-snug mb-1 hover:text-cabin-maroon transition-colors duration-150">
                        {featuredEvent.title}
                      </h3>
                    </Link>
                    <p className="text-sm font-inter text-cabin-stone mb-2">
                      {eventFormattedDate}
                    </p>
                    {featuredEvent.summary && (
                      <p className="text-sm font-inter text-cabin-stone line-clamp-2">
                        {featuredEvent.summary}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row gap-2 flex-shrink-0 items-center sm:pt-1">
                    <ShareButton href={`/events/${featuredEvent.slug.current}`} label="Share Event" />
                    {featuredEvent.registrationUrl && (
                      <a
                        href={featuredEvent.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150 whitespace-nowrap"
                      >
                        Register →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-inter text-cabin-stone text-sm">
                No upcoming events scheduled.
              </p>
            )}
          </section>

          {/* Recent Articles */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-inter font-semibold text-sm uppercase tracking-widest text-cabin-stone">
                Recent Articles
              </h2>
              <Link
                href="/articles"
                className="font-inter text-xs font-semibold uppercase tracking-widest text-cabin-maroon hover:text-cabin-charcoal transition-colors"
              >
                View all articles →
              </Link>
            </div>

            {recentArticles.length > 0 ? (
              <div>
                {recentArticles.map((article: any, index: number) => {
                  const variant = categoryVariant[article.category] ?? 'stone'
                  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  const isLast = index === recentArticles.length - 1
                  return (
                    <Link
                      key={article.slug.current}
                      href={`/articles/${article.slug.current}`}
                      className={`flex gap-4 items-center py-4 transition-all duration-150 block ${!isLast ? 'border-b border-cabin-stone/10' : ''}`}
                    >
                      {/* Cover image */}
                      <div className="flex-shrink-0 w-40 h-28 lg:w-48 lg:h-32 rounded-xl overflow-hidden bg-cabin-mauve">
                        {article.coverImage && (
                          <img
                            src={urlFor(article.coverImage)}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Article info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-geist font-semibold text-cabin-charcoal text-base leading-snug mb-1.5">
                          {article.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-inter text-cabin-stone mb-2">
                          <span>{formattedDate}</span>
                          <span>·</span>
                          <span>5 min read</span>
                          <span>·</span>
                          <Badge variant={variant}>{article.category}</Badge>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-cabin-sky flex items-center justify-center flex-shrink-0">
                            <span className="text-cabin-indigo font-geist font-bold leading-none" style={{ fontSize: '9px' }}>
                              CN
                            </span>
                          </div>
                          <span className="font-inter text-cabin-stone text-sm">Cabin</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="font-inter text-cabin-stone text-sm">
                No articles published yet.
              </p>
            )}
          </section>

        </div>

    </div>
  )
}
