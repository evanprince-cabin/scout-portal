import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPlaybookPages, getPlaybookPageBySlug } from '@/lib/sanity/queries'
import Badge from '@/components/ui/Badge'
import RichText from '@/components/content/RichText'
import PlaybookSidebar from '@/components/content/PlaybookSidebar'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const pages = await getAllPlaybookPages().catch(() => [])
  return pages.map((p: any) => ({ slug: p.slug.current }))
}

const sectionVariant: Record<string, 'strategy' | 'salesforce' | 'workshop' | 'conference' | 'engineering' | 'stone'> = {
  Pitching:    'strategy',
  ICP:         'salesforce',
  Objections:  'workshop',
  FAQ:         'conference',
  Competitive: 'engineering',
}

export default async function PlaybookSlugPage({ params }: { params: { slug: string } }) {
  const [allPages, currentPage] = await Promise.all([
    getAllPlaybookPages().catch(() => []),
    getPlaybookPageBySlug(params.slug).catch(() => null),
  ])

  if (!currentPage) notFound()

  const currentIndex = allPages.findIndex((p: any) => p.slug.current === params.slug)
  const prevPage: any = currentIndex > 0 ? allPages[currentIndex - 1] : null
  const nextPage: any = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null

  const sectionBadgeVariant = sectionVariant[currentPage.section] ?? 'stone'

  return (
    // flex-col on mobile (sidebar dropdown stacks above), flex-row on desktop (sidebar beside content)
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
      <PlaybookSidebar pages={allPages} currentSlug={params.slug} />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <Badge variant={sectionBadgeVariant} className="mb-4">
            {currentPage.section}
          </Badge>

          <h1 className="font-geist font-bold text-3xl text-cabin-charcoal leading-tight mb-6">
            {currentPage.title}
          </h1>

          {currentPage.body ? (
            <RichText value={currentPage.body} />
          ) : (
            <p className="font-inter text-cabin-stone">No content yet.</p>
          )}

          {/* Prev / Next navigation */}
          {(prevPage || nextPage) && (
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-cabin-mauve gap-4">
              {prevPage ? (
                <Link
                  href={`/playbook/${prevPage.slug.current}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-inter font-medium border border-cabin-stone/30 text-cabin-charcoal hover:border-cabin-maroon hover:text-cabin-maroon transition-colors duration-150"
                >
                  ← {prevPage.title}
                </Link>
              ) : (
                <div />
              )}
              {nextPage && (
                <Link
                  href={`/playbook/${nextPage.slug.current}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-inter font-medium border border-cabin-stone/30 text-cabin-charcoal hover:border-cabin-maroon hover:text-cabin-maroon transition-colors duration-150"
                >
                  {nextPage.title} →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
