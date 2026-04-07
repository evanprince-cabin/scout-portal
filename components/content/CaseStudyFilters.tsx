'use client'

interface CaseStudyFiltersProps {
  industries: string[]
  serviceTypes: string[]
  onIndustryChange: (value: string) => void
  onServiceTypeChange: (value: string) => void
}

export default function CaseStudyFilters({
  industries,
  serviceTypes,
  onIndustryChange,
  onServiceTypeChange,
}: CaseStudyFiltersProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <select
        onChange={(e) => onIndustryChange(e.target.value)}
        className="font-inter text-sm border border-cabin-stone/20 rounded-full px-4 py-2 bg-white text-cabin-charcoal focus:outline-none focus:border-cabin-maroon/40"
      >
        <option value="">All Industries</option>
        {industries.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onServiceTypeChange(e.target.value)}
        className="font-inter text-sm border border-cabin-stone/20 rounded-full px-4 py-2 bg-white text-cabin-charcoal focus:outline-none focus:border-cabin-maroon/40"
      >
        <option value="">All Service Types</option>
        {serviceTypes.map((serviceType) => (
          <option key={serviceType} value={serviceType}>
            {serviceType}
          </option>
        ))}
      </select>
    </div>
  )
}
