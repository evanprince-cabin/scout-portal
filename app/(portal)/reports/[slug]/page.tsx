import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getReportBySlug, getAllReports } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import RichText from '@/components/content/RichText'

export const revalidate = 60

export async function generateStaticParams() {
  const reports = await getAllReports().catch(() => [])
  return reports.map((r: any) => ({ slug: r.slug.current }))
}

export default async function ReportPage({ params }: { params: { slug: string } }) {
  const report = await getReportBySlug(params.slug).catch(() => null)

  if (!report) notFound()

  const formattedDate = new Date(report.publishedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const pdfUrl = report.pdfDownload?.asset?.url ?? null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/reports"
        className="inline-flex items-center text-sm font-inter font-medium text-cabin-maroon hover:text-cabin-charcoal transition-colors duration-150"
      >
        ← Back to Reports
      </Link>

      {/* Cover image */}
      {report.coverImage && (
        <div className="w-full h-72 rounded-2xl overflow-hidden bg-cabin-linen">
          <img
            src={urlFor(report.coverImage)}
            alt={report.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div>
        <p className="text-sm font-inter text-cabin-stone mb-2">{formattedDate}</p>
        <h1 className="font-geist font-bold text-4xl text-cabin-charcoal leading-tight">
          {report.title}
        </h1>
        {report.summary && (
          <p className="mt-3 font-inter text-cabin-stone text-lg leading-relaxed">
            {report.summary}
          </p>
        )}
      </div>

      {/* PDF download */}
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-inter font-medium border border-cabin-stone/30 text-cabin-charcoal hover:border-cabin-maroon hover:text-cabin-maroon transition-colors duration-150"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 12V14H14V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 2V10M5 7L8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download PDF
        </a>
      )}

      {/* Body */}
      {report.body && (
        <div className="border-t border-cabin-mauve pt-8">
          <RichText value={report.body} />
        </div>
      )}
    </div>
  )
}
