import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllArticles } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import Badge from '@/components/ui/Badge'
import ShareButton from '@/components/ui/ShareButton'
import RichText from '@/components/content/RichText'

export const revalidate = 60

type BadgeVariant = 'maroon' | 'gold' | 'flame' | 'sky' | 'indigo' | 'stone' | 'grass'
const categoryVariant: Record<string, BadgeVariant> = {
  Strategy:    'maroon',
  Engineering: 'indigo',
  Design:      'sky',
  AI:          'flame',
  Salesforce:  'grass',
}

export async function generateStaticParams() {
  const articles = await getAllArticles().catch(() => [])
  return articles.map((a: any) => ({ slug: a.slug.current }))
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug).catch(() => null)

  if (!article) notFound()

  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const variant = categoryVariant[article.category] ?? 'stone'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/articles"
        className="inline-flex items-center text-sm font-inter font-medium text-cabin-maroon hover:text-cabin-charcoal transition-colors duration-150"
      >
        ← Back to Articles
      </Link>

      {/* Cover image */}
      {article.coverImage && (
        <div className="w-full h-72 rounded-2xl overflow-hidden bg-cabin-linen">
          <img
            src={urlFor(article.coverImage)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div>
        <Badge variant={variant}>{article.category}</Badge>
        <h1 className="mt-3 font-geist font-bold text-4xl text-cabin-charcoal leading-tight">
          {article.title}
        </h1>
        <p className="mt-2 text-sm font-inter text-cabin-stone">{formattedDate}</p>
        {article.summary && (
          <p className="mt-3 font-inter text-cabin-stone text-lg leading-relaxed">
            {article.summary}
          </p>
        )}
      </div>

      {/* Share button */}
      <div className="flex items-center gap-3">
        <ShareButton label="Share this article" />
      </div>

      {/* Body */}
      {article.body && (
        <div className="border-t border-cabin-mauve pt-8">
          <RichText value={article.body} />
        </div>
      )}
    </div>
  )
}
