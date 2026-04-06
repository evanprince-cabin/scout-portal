import EmptyState from '@/components/ui/EmptyState'

export default function CaseStudiesPage() {
  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-geist font-bold text-3xl tracking-tight text-cabin-charcoal">Case Studies</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          In-depth looks at how Cabin has helped clients succeed.
        </p>
      </div>
      <EmptyState heading="Case studies coming soon." />
    </div>
  )
}
