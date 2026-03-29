import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

function ReportSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48 mb-4" />
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-9 w-32 rounded-full" />
    </Card>
  )
}

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Reports</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          In-depth research and market insights from Cabin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportSkeleton />
        <ReportSkeleton />
        <ReportSkeleton />
      </div>
    </div>
  )
}
