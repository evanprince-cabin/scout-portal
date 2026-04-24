'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { getSlidesThumbnailUrl } from '@/lib/slides'

interface Props {
  description?: string
  resourceUrl?: string
  resourceLabel?: string
  tldr?: string[]
  whenToUse?: string
}

export default function PitchingResource({
  description,
  resourceUrl,
  resourceLabel = 'View Presentation',
  tldr = [],
  whenToUse,
}: Props) {
  const [imgError, setImgError] = useState(false)

  const thumbnailUrl = resourceUrl ? getSlidesThumbnailUrl(resourceUrl) : null
  const showThumbnail = thumbnailUrl !== null && !imgError

  return (
    <div>
      {description && (
        <p className="font-inter text-base text-cabin-stone leading-relaxed mb-8">
          {description}
        </p>
      )}

      {/* CTA — thumbnail card (live or fallback image), disabled button when no URL */}
      {resourceUrl ? (
        <a
          href={resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative aspect-video rounded-xl overflow-hidden border border-cabin-stone/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 max-w-[400px]"
        >
          <Image
            src={showThumbnail ? thumbnailUrl! : '/playbook-thumbnail-fallback.png'}
            alt={resourceLabel}
            fill
            className="object-cover"
            sizes="400px"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <span className="absolute bottom-3 right-3 bg-cabin-maroon text-white text-xs font-inter font-medium px-3 py-1.5 rounded-full">
            {resourceLabel} ↗
          </span>
        </a>
      ) : (
        <span className="inline-flex items-center gap-2 bg-cabin-stone/30 text-cabin-stone rounded-full px-6 py-3 font-inter font-medium cursor-not-allowed">
          {resourceLabel}
          <ExternalLink size={16} />
        </span>
      )}

      {tldr.length > 0 && (
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-cabin-stone mb-4">
            Key Points
          </p>
          <ul className="space-y-3">
            {tldr.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cabin-flame flex-shrink-0" />
                <span className="font-inter text-base text-cabin-charcoal leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {whenToUse && (
        <div className="mt-8 bg-cabin-mauve/40 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-cabin-stone mb-1">
            When to use this
          </p>
          <p className="font-inter text-base text-cabin-charcoal">
            {whenToUse}
          </p>
        </div>
      )}
    </div>
  )
}
