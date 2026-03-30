'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import CopyButton from '@/components/ui/CopyButton'
import EmptyState from '@/components/ui/EmptyState'
import { urlFor } from '@/lib/sanity/image'

const CATEGORIES = ['All', 'One-Pager', 'Email Template', 'Case Study', 'Video', 'Brand'] as const

type BadgeVariant = 'maroon' | 'gold' | 'flame' | 'sky' | 'indigo' | 'stone' | 'grass'
const categoryVariant: Record<string, BadgeVariant> = {
  'One-Pager':      'maroon',
  'Email Template': 'sky',
  'Case Study':     'indigo',
  'Video':          'flame',
  'Brand':          'gold',
}

interface Asset {
  title: string
  description?: string
  category: string
  file?: { asset?: { url: string; originalFilename?: string } }
  videoUrl?: string
  thumbnail?: object
  copyableText?: string
}

const IconAsset = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
)

function AssetCard({ asset }: { asset: Asset }) {
  const { title, description, category, file, videoUrl, thumbnail, copyableText } = asset
  const variant = categoryVariant[category] ?? 'stone'
  const fileUrl = file?.asset?.url ?? null

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="h-36 bg-cabin-linen overflow-hidden flex-shrink-0">
        {thumbnail ? (
          <img
            src={urlFor(thumbnail)}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : videoUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-cabin-charcoal">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.15" />
              <path d="M13 11L22 16L13 21V11Z" fill="white" />
            </svg>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M8 4H20L26 10V28H8V4Z" stroke="#C4B5B8" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M20 4V10H26" stroke="#C4B5B8" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 16H20M12 20H17" stroke="#C4B5B8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Badge variant={variant} className="self-start mb-2">{category}</Badge>
        <h3 className="font-geist font-semibold text-cabin-charcoal text-base leading-snug mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm font-inter text-cabin-stone line-clamp-2 mb-4">{description}</p>
        )}

        {/* Action */}
        <div className="mt-auto pt-3">
          {/* Video embed/link */}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 3L9 7L2 11V3Z" fill="currentColor" />
                <path d="M11 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Watch Video
            </a>
          )}

          {/* Copyable text (Email Template / LinkedIn) */}
          {!videoUrl && copyableText && (
            <CopyButton text={copyableText} label="Copy to Clipboard" />
          )}

          {/* File download */}
          {!videoUrl && !copyableText && fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M7 2V8M4.5 5.5L7 8L9.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AssetsClient({ assets }: { assets: Asset[] }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? assets
    : assets.filter(a => a.category === activeCategory)

  return (
    <div className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-inter font-medium transition-colors duration-150 ${
              activeCategory === cat
                ? 'bg-cabin-maroon text-white'
                : 'bg-white text-cabin-stone border border-cabin-stone/30 hover:border-cabin-maroon hover:text-cabin-maroon'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asset grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((asset, i) => (
            <AssetCard key={`${asset.title}-${i}`} asset={asset} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconAsset />}
          heading={activeCategory === 'All' ? 'No assets yet' : `No ${activeCategory} assets yet`}
          subtext="Sales enablement materials will appear here as they're added."
        />
      )}
    </div>
  )
}
