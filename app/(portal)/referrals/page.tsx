import ReferralsClient from '@/components/referrals/ReferralsClient'

export default function ReferralsPage() {
  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-geist font-bold text-3xl tracking-tight text-cabin-charcoal">Referrals</h1>
        <p className="mt-1 font-inter text-cabin-stone text-base">
          Submit a new referral and track the status of your existing ones.
        </p>
      </div>
      <ReferralsClient />
    </div>
  )
}
