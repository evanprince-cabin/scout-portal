'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArticleCard from './ArticleCard'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { urlFor } from '@/lib/sanity/image'

const CATEGORIES = ['All', 'Strategy', 'Engineering', 'Design', 'AI', 'Salesforce'] as const

type BadgeVariant = 'maroon' | 'gold' | 'flame' | 'sky' | 'indigo' | 'stone' | 'grass'
const categoryVariant: Record<string, BadgeVariant> = {
  Strategy:    'maroon',
  Engineering: 'indigo',
  Design:      'sky',
  AI:          'flame',
  Salesforce:  'grass',
}

interface Article {
  title: string
  slug: { current: string }
  publishedDate: string
  category: string
  summary?: string
  coverImage?: object
  featured?: boolean
}

interface Props {
  articles: Article[]
}

export default function ArticlesClient({ articles }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const featuredArticle = articles.find(a => a.featured) ?? null
  const nonFeatured = articles.filter(a => a !== featuredArticle)

  const filteredGrid = activeCategory === 'All'
    ? nonFeatured
    : nonFeatured.filter(a => a.category === activeCategory)

  // If a category is selected that matches the featured article, include it in the grid
  const filteredWithFeatured = activeCategory !== 'All' && featuredArticle?.category === activeCategory
    ? [featuredArticle, ...filteredGrid]
    : filteredGrid

  const IconArticle = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 10h16M4 14h10M4 18h6" />
    </svg>
  )

  return (
    <div className="space-y-8">
      {/* Featured hero — only shown on "All" */}
      {activeCategory === 'All' && featuredArticle && (
        <Link
          href={`/articles/${featuredArticle.slug.current}`}
          className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="relative h-72 w-full bg-cabin-linen overflow-hidden">
            {featuredArticle.coverImage ? (
              <img
                src={urlFor(featuredArticle.coverImage)}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-cabin-charcoal/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge variant={categoryVariant[featuredArticle.category] ?? 'stone'}>
                {featuredArticle.category}
              </Badge>
              <h2 className="mt-2 font-geist font-bold text-white text-2xl leading-snug group-hover:text-cabin-gold transition-colors duration-150">
                {featuredArticle.title}
              </h2>
              {featuredArticle.summary && (
                <p className="mt-1 text-sm font-inter text-white/80 line-clamp-2">
                  {featuredArticle.summary}
                </p>
              )}
              <span className="mt-3 inline-flex items-center text-sm font-inter font-semibold text-cabin-gold">
                Read Article →
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Category filter */}
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

      {/* Article grid */}
      {filteredWithFeatured.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWithFeatured.map(article => (
            <ArticleCard key={article.slug.current} article={article} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconArticle />}
          heading={`No ${activeCategory} articles yet`}
          subtext="Check back soon for new content in this category."
        />
      )}
    </div>
  )
}
