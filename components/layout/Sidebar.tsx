'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/reports', label: 'Reports' },
  { href: '/articles', label: 'Articles' },
  { href: '/playbook', label: 'Playbook' },
  { href: '/assets', label: 'Assets' },
  { href: '/events', label: 'Events' },
  { href: '/referrals', label: 'Referrals' },
]

function CabinIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 3L3 11V25H10V17H18V25H25V11L14 3Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M10 25V18C10 16.343 11.343 15 13 15H15C16.657 15 18 16.343 18 18V25"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

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

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3">
        <CabinIcon />
        <span className="text-white font-geist font-bold text-lg tracking-tight">Cabin Scout</span>
      </div>
      <div className="mx-4 h-px bg-white/10" />

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`
                flex items-center px-4 py-2.5 rounded-full text-sm font-inter font-medium transition-colors duration-150
                ${isActive
                  ? 'bg-white text-cabin-maroon'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-4 h-px bg-white/10" />

      {/* User */}
      <div className="px-6 py-5 flex items-center gap-3">
        <UserButton afterSignOutUrl="/sign-in" />
        {user && (
          <span className="text-sm font-inter text-white/70 truncate">
            {user.firstName ?? user.primaryEmailAddress?.emailAddress}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 bg-cabin-maroon z-30">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-cabin-maroon px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CabinIcon />
          <span className="text-white font-geist font-bold text-base tracking-tight">Cabin Scout</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-1"
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
          <aside className="relative w-72 bg-cabin-maroon flex flex-col h-full z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
            <SidebarContent onLinkClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
