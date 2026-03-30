import { redirect } from 'next/navigation'
import { getAllPlaybookPages } from '@/lib/sanity/queries'
import EmptyState from '@/components/ui/EmptyState'

export const revalidate = 60

const IconBook = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
)

export default async function PlaybookPage() {
  const pages = await getAllPlaybookPages().catch(() => [])

  if (pages.length > 0) {
    redirect(`/playbook/${pages[0].slug.current}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Playbook</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Your complete guide to pitching and closing with Cabin.
        </p>
      </div>
      <EmptyState
        icon={<IconBook />}
        heading="Playbook coming soon"
        subtext="Cabin's scout playbook is being prepared. Check back soon."
      />
    </div>
  )
}
