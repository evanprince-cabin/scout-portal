import Skeleton from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-56 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <Skeleton className="h-10 w-10 mb-3" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>

      {/* Latest Report */}
      <section>
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="bg-cabin-mauve rounded-2xl h-52 animate-pulse" />
      </section>

      {/* Recent Articles */}
      <section>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <Skeleton className="h-40 rounded-none" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-9 w-24 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-40 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </section>
    </div>
  )
}
