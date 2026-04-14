'use client'

import { useState } from 'react'
import AssetCard, { type Asset } from '@/components/content/AssetCard'
import EmptyState from '@/components/ui/EmptyState'

const CATEGORIES = ['All', 'Email Template', 'Message', 'One-Pager', 'Slide Deck', 'Video', 'Brand'] as const

const IconAsset = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
)

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
          heading={activeCategory === 'All' ? 'No assets yet.' : 'No assets in this category yet.'}
          subtext="Sales enablement materials will appear here as they're added."
        />
      )}
    </div>
  )
}
