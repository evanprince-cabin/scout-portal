import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'

interface Report {
  title: string
  slug: { current: string }
  publishedDate: string
  summary?: string
  coverImage?: object
}

export default function ReportCard({ report }: { report: Report }) {
  const { title, slug, publishedDate, summary, coverImage } = report

  const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cabin-stone/20 hover:shadow-md hover:border-cabin-maroon/30 transition-all duration-200 hover:-translate-y-0.5">
      <div className="h-48 w-full bg-cabin-linen overflow-hidden">
        {coverImage ? (
          <img
            src={urlFor(coverImage)}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
      <div className="p-6">
        <p className="text-xs font-inter font-medium text-cabin-stone uppercase tracking-wide mb-2">
          {formattedDate}
        </p>
        <h3 className="font-geist font-bold text-cabin-charcoal text-xl leading-snug mb-3">{title}</h3>
        {summary && (
          <p className="text-sm font-inter text-cabin-stone line-clamp-3 mb-5">{summary}</p>
        )}
        <Link
          href={`/reports/${slug.current}`}
          className="inline-flex items-center text-sm font-inter font-semibold text-cabin-maroon hover:text-cabin-charcoal transition-colors duration-150"
        >
          Read Report →
        </Link>
      </div>
    </div>
  )
}
