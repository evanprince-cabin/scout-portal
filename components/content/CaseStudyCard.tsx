import Image from 'next/image'
import { Download } from 'lucide-react'
import Badge from '@/components/ui/Badge'
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

  return (
    <div className="bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl overflow-hidden hover:shadow-md hover:border-cabin-stone/40 transition-all duration-150 flex flex-col">
      {coverImage ? (
        <div className="relative h-48 w-full">
          <Image
            src={urlFor(coverImage)}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-cabin-mauve" />
      )}

      <div className="p-5 flex flex-col flex-1">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-cabin-stone">
            {client}
          </span>
        </div>

        <h3 className="font-geist font-semibold text-cabin-charcoal text-base leading-snug mt-1 mb-2">
          {title}
        </h3>

        <p className="font-inter text-sm text-cabin-stone line-clamp-3 mb-4">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {(Array.isArray(industry) ? industry : [industry]).map((v) => <Badge key={v} variant="stone">{v}</Badge>)}
          {(Array.isArray(serviceType) ? serviceType : [serviceType]).map((v) => <Badge key={v} variant="stone">{v}</Badge>)}
        </div>

        <div className="mt-auto pt-4">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cabin-maroon text-white rounded-full px-5 py-2 text-sm font-inter font-medium hover:bg-cabin-charcoal transition-colors duration-150 w-full text-center block"
          >
            View Case Study
          </a>
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-1.5 w-full rounded-full border border-cabin-stone/30 px-5 py-2 text-sm font-inter font-medium text-cabin-stone hover:border-cabin-maroon/40 hover:text-cabin-maroon transition-colors duration-150"
            >
              <Download size={14} />
              Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
