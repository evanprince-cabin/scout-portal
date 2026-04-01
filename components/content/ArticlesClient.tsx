'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArticleCard from './ArticleCard'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { urlFor } from '@/lib/sanity/image'

const CATEGORIES = ['All', 'Strategy', 'Engineering', 'Design', 'AI', 'Salesforce'] as const

type BadgeVariant = 'strategy' | 'engineering' | 'design' | 'ai' | 'salesforce' | 'featured' | 'stone'
const categoryVariant: Record<string, BadgeVariant> = {
  Strategy:    'strategy',
  Engineering: 'engineering',
  Design:      'design',
  AI:          'ai',
  Salesforce:  'salesforce',
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

  // Hero shows on "All" or when the featured article's category matches the active filter
  const showHero = featuredArticle && (
    activeCategory === 'All' || featuredArticle.category === activeCategory
  )

  const filteredGrid = activeCategory === 'All'
    ? nonFeatured
    : nonFeatured.filter(a => a.category === activeCategory)

  // Include featured in the grid when its category is filtered (but not on "All" — it's in the hero)
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

      {/* Featured hero — below filters, shown on "All" or matching category */}
      {showHero && (
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
            <span className="absolute top-4 left-4 z-10">
              <Badge variant="featured">Featured</Badge>
            </span>
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
          heading={activeCategory === 'All' ? 'Nothing here yet. Good things take time.' : 'No articles in this category yet.'}
          subtext={activeCategory === 'All' ? '' : 'Check back soon for new content.'}
        />
      )}
    </div>
  )
}
