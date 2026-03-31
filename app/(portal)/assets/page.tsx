import { getAllAssets } from '@/lib/sanity/queries'
import AssetsClient from '@/components/content/AssetsClient'

export const revalidate = 60

export default async function AssetsPage() {
  const assets = await getAllAssets().catch(() => [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-geist font-bold text-3xl text-cabin-charcoal">Assets</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Sales enablement materials to help you close more deals.
        </p>
      </div>
      <AssetsClient assets={assets} />
    </div>
  )
}
