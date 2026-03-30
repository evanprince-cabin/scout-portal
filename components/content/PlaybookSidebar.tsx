'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SECTION_ORDER = ['Pitching', 'ICP', 'Objections', 'FAQ', 'Competitive']

interface PlaybookPage {
  title: string
  slug: { current: string }
  section: string
  order: number
}

interface Props {
  pages: PlaybookPage[]
  currentSlug: string
}

export default function PlaybookSidebar({ pages, currentSlug }: Props) {
  const router = useRouter()

  const grouped = SECTION_ORDER.reduce<Record<string, PlaybookPage[]>>((acc, section) => {
    acc[section] = pages.filter(p => p.section === section)
    return acc
  }, {})

  // Also catch any pages with sections not in SECTION_ORDER
  pages.forEach(p => {
    if (!SECTION_ORDER.includes(p.section)) {
      if (!grouped[p.section]) grouped[p.section] = []
      grouped[p.section].push(p)
    }
  })

  const allSections = [...SECTION_ORDER, ...Object.keys(grouped).filter(s => !SECTION_ORDER.includes(s))]
    .filter(s => (grouped[s] ?? []).length > 0)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 flex-shrink-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm sticky top-8">
          <p className="font-geist font-bold text-cabin-charcoal text-base mb-4 px-2">Playbook</p>
          <nav>
            {allSections.map(section => (
              <div key={section} className="mb-4">
                <p className="text-xs font-inter font-medium text-cabin-stone uppercase tracking-wider px-2 mb-1">
                  {section}
                </p>
                <ul className="space-y-0.5">
                  {(grouped[section] ?? []).map(page => {
                    const isActive = page.slug.current === currentSlug
                    return (
                      <li key={page.slug.current}>
                        <Link
                          href={`/playbook/${page.slug.current}`}
                          className={`flex items-center px-2 py-2 rounded-lg text-sm font-inter transition-colors duration-150 border-l-2 ${
                            isActive
                              ? 'border-cabin-flame text-cabin-maroon font-semibold bg-cabin-mauve/50'
                              : 'border-transparent text-cabin-stone hover:text-cabin-charcoal hover:bg-cabin-linen'
                          }`}
                        >
                          {page.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile dropdown */}
      <div className="md:hidden mb-6">
        <select
          value={currentSlug}
          onChange={e => router.push(`/playbook/${e.target.value}`)}
          className="w-full rounded-full px-4 py-2.5 text-sm font-inter border border-cabin-stone/30 bg-white text-cabin-charcoal focus:outline-none focus:border-cabin-maroon appearance-none"
        >
          {allSections.map(section => (
            <optgroup key={section} label={section}>
              {(grouped[section] ?? []).map(page => (
                <option key={page.slug.current} value={page.slug.current}>
                  {page.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </>
  )
}
