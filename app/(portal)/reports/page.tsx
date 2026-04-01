import { getAllReports } from '@/lib/sanity/queries'
import ReportCard from '@/components/content/ReportCard'
import EmptyState from '@/components/ui/EmptyState'

export const revalidate = 60

const IconReport = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

export default async function ReportsPage() {
  const reports = await getAllReports().catch(() => [])

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-geist font-bold text-3xl tracking-tight text-cabin-charcoal">Monthly Reports</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Stay up to date on Cabin&apos;s growth, clients, and company landscape.
        </p>
      </div>

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report: any) => (
            <ReportCard key={report.slug.current} report={report} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconReport />}
          heading="No reports yet — check back soon. We publish monthly."
          subtext=""
        />
      )}
    </div>
  )
}
