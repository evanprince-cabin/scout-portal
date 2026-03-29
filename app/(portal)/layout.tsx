import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/reports', label: 'Reports' },
  { href: '/articles', label: 'Articles' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/assets', label: 'Assets' },
  { href: '/events', label: 'Events' },
  { href: '/referrals', label: 'Referrals' },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-700">
          <span className="text-lg font-semibold tracking-tight">Cabin Scout Portal</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-700 flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <span className="text-sm text-gray-400">Account</span>
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  )
}
