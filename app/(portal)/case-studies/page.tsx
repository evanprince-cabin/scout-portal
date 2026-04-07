'use client'

import { useEffect, useState } from 'react'
import { getCaseStudies } from '@/lib/sanity/queries'
import CaseStudyCard from '@/components/content/CaseStudyCard'
import CaseStudyFilters from '@/components/content/CaseStudyFilters'
import EmptyState from '@/components/ui/EmptyState'

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
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedServiceType, setSelectedServiceType] = useState('')

  useEffect(() => {
    getCaseStudies().then((data) => setCaseStudies(data ?? []))
  }, [])

  const industries = Array.from(new Set(caseStudies.flatMap((cs) => cs.industry ?? []))).sort()
  const serviceTypes = Array.from(new Set(caseStudies.flatMap((cs) => cs.serviceType ?? []))).sort()

  const filtered = caseStudies.filter((cs) => {
    if (selectedIndustry && !cs.industry?.includes(selectedIndustry)) return false
    if (selectedServiceType && !cs.serviceType?.includes(selectedServiceType)) return false
    return true
  })

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-5xl">
          {filtered.map((cs) => (
            <CaseStudyCard
              key={cs._id}
              title={cs.title}
              client={cs.client}
              description={cs.description}
              industry={cs.industry}
              serviceType={cs.serviceType}
              coverImage={cs.coverImage}
              slideUrl={cs.slideUrl}
              slug={cs.slug}
            />
          ))}
        </div>
      )}
    </div>
  )
}
