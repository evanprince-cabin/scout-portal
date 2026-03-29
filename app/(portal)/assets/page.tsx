'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
const categories = ['All', 'One-Pager', 'Email Template', 'Case Study', 'Video', 'Brand']

function AssetSkeleton() {
  return (
    <Card className="flex flex-col gap-3">
      <Skeleton className="h-36" />
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </Card>
  )
}

export default function AssetsPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Assets</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Sales enablement materials to help you close more deals.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-4 py-2 rounded-full text-sm font-inter font-medium transition-colors duration-150
              ${activeCategory === cat
                ? 'bg-cabin-maroon text-white'
                : 'bg-white text-cabin-stone border border-cabin-stone/30 hover:border-cabin-maroon hover:text-cabin-maroon'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AssetSkeleton />
        <AssetSkeleton />
        <AssetSkeleton />
        <AssetSkeleton />
        <AssetSkeleton />
        <AssetSkeleton />
      </div>
    </div>
  )
}
