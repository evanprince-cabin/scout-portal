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
    <div className="bg-cabin-maroon rounded-2xl overflow-hidden shadow-sm">
      {coverImage && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={urlFor(coverImage)}
            alt={title}
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      )}
      <div className="p-6">
        <p className="text-xs font-inter font-medium text-white/60 uppercase tracking-wide mb-2">
          {formattedDate}
        </p>
        <h3 className="font-geist font-bold text-white text-xl leading-snug mb-3">{title}</h3>
        {summary && (
          <p className="text-sm font-inter text-white/75 line-clamp-3 mb-5">{summary}</p>
        )}
        <Link
          href={`/reports/${slug.current}`}
          className="inline-flex items-center text-sm font-inter font-semibold text-cabin-gold hover:text-white transition-colors duration-150"
        >
          Read Report →
        </Link>
      </div>
    </div>
  )
}
