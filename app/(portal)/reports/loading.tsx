import Skeleton from '@/components/ui/Skeleton'

export default function ReportsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="h-48 rounded-none" />
            <div className="p-6 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-24 mt-2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
