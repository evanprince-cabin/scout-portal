'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

const categories = ['All', 'Strategy', 'Engineering', 'Design', 'AI', 'Salesforce']

function ArticleSkeleton() {
  return (
    <Card>
      <Skeleton className="h-40 mb-4" />
      <Skeleton className="h-4 w-1/4 mb-3" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  )
}

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Articles</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Perspectives and insights from the Cabin team.
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
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
        <ArticleSkeleton />
      </div>
    </div>
  )
}
