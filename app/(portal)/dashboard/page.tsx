import { currentUser } from '@clerk/nextjs/server'
import { getDashboardData } from '@/lib/sanity/queries'
import { getReferralStats } from '@/lib/supabase/referrals'
import StatCard from '@/components/dashboard/StatCard'
import QuickActions from '@/components/dashboard/QuickActions'
import ReportCard from '@/components/content/ReportCard'
import ArticleCard from '@/components/content/ArticleCard'
import EventCard from '@/components/content/EventCard'
import EmptyState from '@/components/ui/EmptyState'

export const dynamic = 'force-dynamic'

const IconSend = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const IconActivity = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const IconTrophy = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0012 0V2z" />
  </svg>
)

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName ?? 'Scout'

  const [stats, dashboardData] = await Promise.all([
    user?.id
      ? getReferralStats(user.id).catch(() => ({ submitted: 0, active: 0, closedWon: 0 }))
      : Promise.resolve({ submitted: 0, active: 0, closedWon: 0 }),
    getDashboardData().catch(() => ({
      latestReport: null,
      recentArticles: [],
      upcomingEvents: [],
    })),
  ])

  const latestReport = dashboardData?.latestReport ?? null
  const recentArticles = dashboardData?.recentArticles ?? []
  const upcomingEvents = dashboardData?.upcomingEvents ?? []

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">
          Hey {firstName} 👋
        </h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Here&apos;s what&apos;s happening at Cabin.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Referrals Submitted"
          value={stats.submitted}
          icon={<IconSend />}
        />
        <StatCard
          label="Referrals Active"
          value={stats.active}
          icon={<IconActivity />}
        />
        <StatCard
          label="Closed Won"
          value={stats.closedWon}
          icon={<IconTrophy />}
        />
      </div>

      {/* Latest Report */}
      <section>
        <h2 className="font-geist font-semibold text-cabin-charcoal text-xl mb-4">
          Latest Report
        </h2>
        {latestReport ? (
          <ReportCard report={latestReport} />
        ) : (
          <div className="bg-cabin-maroon rounded-2xl p-10 text-center">
            <p className="font-geist font-semibold text-white text-lg">
              No reports published yet
            </p>
            <p className="mt-1 font-inter text-white/60 text-sm">
              Check back soon — Cabin publishes monthly scout reports.
            </p>
          </div>
        )}
      </section>

      {/* Recent Articles */}
      <section>
        <h2 className="font-geist font-semibold text-cabin-charcoal text-xl mb-4">
          Latest from Cabin
        </h2>
        {recentArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentArticles.map((article: any) => (
              <ArticleCard key={article.slug.current} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            heading="No articles yet"
            subtext="Cabin's editorial content will appear here."
          />
        )}
      </section>

      {/* Upcoming Events */}
      <section>
        <h2 className="font-geist font-semibold text-cabin-charcoal text-xl mb-4">
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event: any) => (
              <EventCard key={event.slug.current} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            heading="No upcoming events"
            subtext="Cabin webinars and events will be listed here."
          />
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="font-geist font-semibold text-cabin-charcoal text-xl mb-4">
          Quick Actions
        </h2>
        <QuickActions />
      </section>
    </div>
  )
}
