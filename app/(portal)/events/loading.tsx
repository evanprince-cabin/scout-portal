import Skeleton from '@/components/ui/Skeleton'

export default function EventsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-24 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      {/* Upcoming section */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-40" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
