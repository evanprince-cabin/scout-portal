'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import {
  LayoutDashboard,
  FileText,
  BookMarked,
  Map,
  FolderOpen,
  Calendar,
  Send,
} from 'lucide-react'

const navSections = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { href: '/case-studies', label: 'Case Studies', icon: BookMarked },
      { href: '/playbook', label: 'Playbook', icon: Map },
      { href: '/assets', label: 'Assets', icon: FolderOpen },
      { href: '/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { href: '/events', label: 'Events', icon: Calendar },
    ],
  },
  {
    label: 'MY SCOUT',
    items: [
      { href: '/referrals', label: 'Referrals', icon: Send },
    ],
  },
]

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const LS_KEY = 'cabin_last_viewed_reports'

function SidebarContent({
  onLinkClick,
  latestReportCreatedAt,
}: {
  onLinkClick?: () => void
  latestReportCreatedAt: string | null
}) {
  const pathname = usePathname()
  const { user } = useUser()
  const [hasNewReport, setHasNewReport] = useState(false)

  // Check for new report on mount
  useEffect(() => {
    if (!latestReportCreatedAt) return
    const lastViewed = localStorage.getItem(LS_KEY)
    if (!lastViewed || new Date(latestReportCreatedAt) > new Date(lastViewed)) {
      setHasNewReport(true)
    }
  }, [latestReportCreatedAt])

  // Clear dot when scout visits /reports
  useEffect(() => {
    if (pathname === '/reports' || pathname.startsWith('/reports/')) {
      localStorage.setItem(LS_KEY, new Date().toISOString())
      setHasNewReport(false)
    }
  }, [pathname])

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 mb-6">
        <Image src="/cabin-wordmark-charcoal.png" alt="Cabin" width={89} height={24} className="object-contain" />
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-4 overflow-y-auto">
        {navSections.map((section, sectionIdx) => (
          <div key={section.label} className={sectionIdx === 0 ? 'mb-2' : 'mt-6 mb-2'}>
            <p className="px-3 mb-1 text-xs font-medium uppercase tracking-wider text-cabin-stone/60">
              {section.label}
            </p>
            <div className="space-y-1.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onLinkClick}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-full text-sm font-inter font-medium transition-colors duration-150
                      ${isActive
                        ? 'bg-gray-200 border border-gray-300 text-cabin-charcoal font-medium'
                        : 'text-cabin-stone border border-transparent hover:bg-white hover:border-cabin-stone/20 hover:text-cabin-charcoal'
                      }
                    `}
                  >
                    <Icon size={16} className="text-current" />
                    <span className="flex-1">{label}</span>
                    {href === '/reports' && hasNewReport && (
                      <span className="w-2 h-2 rounded-full bg-cabin-maroon flex-shrink-0" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User area */}
      <div className="mx-4 mt-4 pt-4 px-2 pb-5 flex items-center gap-3">
        <UserButton afterSignOutUrl="/sign-in" />
        {user && (
          <span className="text-sm font-inter text-cabin-stone truncate">
            {user.firstName ?? user.primaryEmailAddress?.emailAddress}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ latestReportCreatedAt }: { latestReportCreatedAt: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-cabin-linen z-30">
        <SidebarContent latestReportCreatedAt={latestReportCreatedAt} />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-cabin-linen border-b border-cabin-stone/15 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/cabin-wordmark-charcoal.png" alt="Cabin" width={89} height={24} className="object-contain" />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-cabin-stone p-1.5"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-cabin-linen border-r border-cabin-stone/15 flex flex-col h-full z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-cabin-stone hover:text-cabin-charcoal"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
            <SidebarContent onLinkClick={() => setMobileOpen(false)} latestReportCreatedAt={latestReportCreatedAt} />
          </aside>
        </div>
      )}
    </>
  )
}
