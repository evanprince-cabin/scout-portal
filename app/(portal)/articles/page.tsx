import { getAllArticles } from '@/lib/sanity/queries'
import ArticlesClient from '@/components/content/ArticlesClient'

export const revalidate = 60

export default async function ArticlesPage() {
  const articles = await getAllArticles().catch(() => [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Articles</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Insights and perspectives from the team at Cabin.
        </p>
      </div>
      <ArticlesClient articles={articles} />
    </div>
  )
}
