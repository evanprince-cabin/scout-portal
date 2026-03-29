import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

function EventSkeleton() {
  return (
    <Card className="flex flex-col gap-3">
      <Skeleton className="h-44" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-9 w-36 rounded-full mt-2" />
    </Card>
  )
}

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Events</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Webinars, workshops, and conferences from Cabin.
        </p>
      </div>

      <div>
        <p className="text-xs font-inter font-medium text-cabin-stone uppercase tracking-wide mb-4">
          Upcoming
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventSkeleton />
          <EventSkeleton />
          <EventSkeleton />
        </div>
      </div>
    </div>
  )
}
