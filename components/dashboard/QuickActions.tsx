import Link from 'next/link'

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/referrals"
        className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-inter font-medium bg-cabin-maroon text-white hover:bg-cabin-charcoal transition-colors duration-150"
      >
        Submit a Referral
      </Link>
      <Link
        href="/assets"
        className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-inter font-medium bg-cabin-gold text-cabin-charcoal hover:opacity-90 transition-colors duration-150"
      >
        Browse Assets
      </Link>
      <Link
        href="/playbook"
        className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-inter font-medium border border-cabin-stone text-cabin-charcoal hover:bg-cabin-mauve transition-colors duration-150"
      >
        Read the Playbook
      </Link>
    </div>
  )
}
