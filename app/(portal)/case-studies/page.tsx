'use client'

import { useCallback, useEffect, useState } from 'react'
import { getCaseStudies } from '@/lib/sanity/queries'
import CaseStudyCard from '@/components/content/CaseStudyCard'
import CaseStudyFilters from '@/components/content/CaseStudyFilters'
import EmptyState from '@/components/ui/EmptyState'
import ReplaceBookmarkModal from '@/components/ui/ReplaceBookmarkModal'
import { useToast } from '@/lib/toast'
import type { Favorite } from '@/lib/supabase/favorites'

interface CaseStudy {
  _id: string
  title: string
  slug: { current: string }
  client: string
  description: string
  industry: string[]
  serviceType: string[]
  coverImage?: object
  slideUrl: string
  featured: boolean
  popular?: boolean
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedServiceType, setSelectedServiceType] = useState('')
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [pendingBookmark, setPendingBookmark] = useState<CaseStudy | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    getCaseStudies().then((data) => setCaseStudies(data ?? []))
  }, [])

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => setFavorites(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  async function postBookmark(cs: CaseStudy): Promise<Favorite | null> {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_type: 'case_study',
        content_id: cs._id,
        title: cs.title,
        slug: cs.slug.current,
        url: cs.slideUrl ?? null,
        popular: cs.popular ?? false,
      }),
    })
    if (!res.ok) return null
    return res.json()
  }

  const handleBookmark = useCallback(async (cs: CaseStudy) => {
    if (favorites.length >= 6) {
      setPendingBookmark(cs)
      return
    }
    try {
      const newFav = await postBookmark(cs)
      if (!newFav) { showToast('Something went wrong. Try again.', 'error'); return }
      setFavorites((prev) => [...prev, newFav])
      showToast('Bookmark added.', 'success')
    } catch {
      showToast('Something went wrong. Try again.', 'error')
    }
  }, [favorites])

  const handleUnbookmark = useCallback(async (favoriteId: string) => {
    try {
      await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' })
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
    } catch {
      showToast('Something went wrong. Try again.', 'error')
    }
  }, [])

  const handleReplace = useCallback(async (favoriteId: string) => {
    if (!pendingBookmark) return
    try {
      await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' })
      const newFav = await postBookmark(pendingBookmark)
      if (!newFav) { showToast('Something went wrong. Try again.', 'error'); return }
      setFavorites((prev) => [...prev.filter((f) => f.id !== favoriteId), newFav])
      setPendingBookmark(null)
      showToast('Bookmark replaced.', 'success')
    } catch {
      showToast('Something went wrong. Try again.', 'error')
    }
  }, [pendingBookmark])

  const industries = Array.from(new Set(caseStudies.flatMap((cs) => cs.industry ?? []))).sort()
  const serviceTypes = Array.from(new Set(caseStudies.flatMap((cs) => cs.serviceType ?? []))).sort()

  const filtered = caseStudies
    .filter((cs) => {
      if (selectedIndustry && !cs.industry?.includes(selectedIndustry)) return false
      if (selectedServiceType && !cs.serviceType?.includes(selectedServiceType)) return false
      return true
    })
    .sort((a, b) => a.client.localeCompare(b.client))

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-geist font-bold text-3xl tracking-tight text-cabin-charcoal">
          Case Studies
        </h1>
        <p className="font-inter text-cabin-stone text-sm mt-1">
          In-depth looks at how Cabin has helped clients succeed.
        </p>
      </div>

      <CaseStudyFilters
        industries={industries}
        serviceTypes={serviceTypes}
        onIndustryChange={setSelectedIndustry}
        onServiceTypeChange={setSelectedServiceType}
      />

      {filtered.length === 0 ? (
        <EmptyState
          heading="No case studies found."
          subtext="Try adjusting your filters or check back later."
        />
      ) : (
        <div className="flex flex-col divide-y divide-cabin-stone/10">
          {filtered.map((cs) => {
            const fav = favorites.find((f) => f.content_type === 'case_study' && f.content_id === cs._id)
            return (
              <CaseStudyCard
                key={cs._id}
                _id={cs._id}
                title={cs.title}
                client={cs.client}
                description={cs.description}
                industry={cs.industry}
                serviceType={cs.serviceType}
                coverImage={cs.coverImage}
                slideUrl={cs.slideUrl}
                slug={cs.slug}
                popular={cs.popular}
                isBookmarked={!!fav}
                favoriteId={fav?.id ?? null}
                onBookmark={() => handleBookmark(cs)}
                onUnbookmark={handleUnbookmark}
              />
            )
          })}
        </div>
      )}

      {pendingBookmark && (
        <ReplaceBookmarkModal
          isOpen={!!pendingBookmark}
          onClose={() => setPendingBookmark(null)}
          newItemTitle={pendingBookmark.title}
          favorites={favorites}
          onReplace={handleReplace}
        />
      )}

    </div>
  )
}
