import Skeleton from '@/components/ui/Skeleton'

export default function AssetsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-24 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <Skeleton className="h-[180px] rounded-none" />
            <div className="p-5 space-y-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-8 w-28 rounded-full mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
