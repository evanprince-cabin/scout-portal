import Image from 'next/image'
import { Download } from 'lucide-react'
import { urlFor } from '@/lib/sanity/image'

function extractSlideUrls(slideUrl: string) {
  const match = slideUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)
  const id = match ? match[1] : null
  return {
    viewUrl: slideUrl,
    downloadUrl: id ? `https://docs.google.com/presentation/d/${id}/export/pdf` : null,
  }
}

interface CaseStudyCardProps {
  title: string
  client: string
  description: string
  industry: string[]
  serviceType: string[]
  coverImage?: object
  slideUrl: string
  slug: { current: string }
}

export default function CaseStudyCard({
  title,
  client,
  description,
  industry,
  serviceType,
  coverImage,
  slideUrl,
}: CaseStudyCardProps) {
  const { viewUrl, downloadUrl } = extractSlideUrls(slideUrl)
  const industryArr = Array.isArray(industry) ? industry : [industry]
  const serviceTypeArr = Array.isArray(serviceType) ? serviceType : [serviceType]

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 py-7 px-4 rounded-xl hover:bg-cabin-mauve/20 transition-colors duration-150">
      {/* Clickable overlay — makes the whole row navigate to the slide */}
      <a
        href={viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0"
        aria-label={`View ${title} case study`}
      />

      {/* Thumbnail */}
      <div className="relative z-[1] w-full h-48 sm:w-[180px] sm:h-[114px] sm:flex-shrink-0 rounded-[14px] overflow-hidden pointer-events-none border border-cabin-stone/15 shadow-sm">
        {coverImage ? (
          <Image
            src={urlFor(coverImage)}
            alt={title}
            width={180}
            height={114}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-cabin-mauve" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-[1] flex-1 flex flex-col gap-1.5 pt-0.5 min-w-0 pointer-events-none">
        <span className="text-sm font-bold uppercase tracking-[0.09em] text-cabin-flame font-inter">
          {client}
        </span>

        <h3 className="font-geist font-semibold text-[19px] text-cabin-charcoal leading-snug">
          {title}
        </h3>

        <p className="font-inter text-[13.5px] text-cabin-stone leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between gap-4 mt-1">
          <div className="flex flex-wrap gap-1.5">
            {industryArr.map((v) => (
              <span
                key={v}
                className="bg-cabin-linen border border-cabin-stone/20 rounded-full px-2.5 py-0.5 text-sm font-medium text-cabin-stone font-inter"
              >
                {v}
              </span>
            ))}
            {serviceTypeArr.map((v) => (
              <span
                key={v}
                className="border border-cabin-stone/20 rounded-full px-2.5 py-0.5 text-sm font-medium text-cabin-stone font-inter"
              >
                {v}
              </span>
            ))}
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-[2] pointer-events-auto inline-flex items-center gap-1 text-sm font-inter font-semibold text-cabin-stone hover:text-cabin-maroon transition-colors duration-150"
            >
              <Download size={12} />
              PDF
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
