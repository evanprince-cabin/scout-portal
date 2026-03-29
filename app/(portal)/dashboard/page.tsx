import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'

function StatCard({ label }: { label: string }) {
  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm font-inter text-cabin-stone">{label}</p>
      <Skeleton className="h-9 w-16" />
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">
          Welcome to Cabin Scout Portal
        </h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Your hub for referrals, resources, and everything Cabin.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Referrals Submitted" />
        <StatCard label="Active" />
        <StatCard label="Closed Won" />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest report */}
        <Card className="lg:col-span-1">
          <p className="text-xs font-inter font-medium text-cabin-stone uppercase tracking-wide mb-3">
            Latest Report
          </p>
          <Skeleton className="h-40 mb-4" />
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </Card>

        {/* Recent articles */}
        <Card className="lg:col-span-2">
          <p className="text-xs font-inter font-medium text-cabin-stone uppercase tracking-wide mb-3">
            Recent Articles
          </p>
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-14 w-14 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <p className="text-xs font-inter font-medium text-cabin-stone uppercase tracking-wide mb-4">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Submit a Referral</Button>
          <Button variant="secondary">Browse Assets</Button>
          <Button variant="ghost">Read the Playbook</Button>
        </div>
      </Card>
    </div>
  )
}
