import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { urlFor } from '@/lib/sanity/image'

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

export default function ArticleCard({ article }: { article: Article }) {
  const { title, slug, publishedDate, category, coverImage, featured } = article
  const variant = categoryVariant[category] ?? 'stone'

  const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      href={`/articles/${slug.current}`}
      className="group block bg-white rounded-2xl shadow-sm border border-cabin-stone/20 hover:shadow-md hover:border-cabin-maroon/30 transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="relative h-40 w-full bg-cabin-linen overflow-hidden">
        {coverImage ? (
          <img
            src={urlFor(coverImage)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-cabin-linen" />
        )}
        {featured && (
          <span className="absolute top-3 left-3 z-10">
            <Badge variant="featured">Featured</Badge>
          </span>
        )}
      </div>
      <div className="p-5">
        <Badge variant={variant}>{category}</Badge>
        <h3 className="mt-2 font-geist font-semibold text-cabin-charcoal text-base leading-snug group-hover:text-cabin-maroon transition-colors duration-150 line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-xs font-inter text-cabin-stone">{formattedDate}</p>
      </div>
    </Link>
  )
}
