'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderOpen, FileText, BookMarked, Map, Bookmark, Users } from 'lucide-react'
import { getAllAssets, getReports, getCaseStudies, getAllPlaybookPages } from '@/lib/sanity/queries'
import type { Favorite } from '@/lib/supabase/favorites'

interface AddFavoritesDrawerProps {
  isOpen: boolean
  onClose: () => void
  favorites: Favorite[]
  onAdd: (item: { content_type: string; content_id: string; title: string; slug: string | null; url: string | null; popular: boolean }) => void
}

const TABS = ['Assets', 'Reports', 'Case Studies', 'Playbook'] as const
type Tab = typeof TABS[number]

type DrawerItem = {
  _id?: string
  title: string
  slug?: { current: string }
  slideUrl?: string
  popular?: boolean
}

const TAB_ICONS: Record<Tab, { Icon: typeof FolderOpen; color: string }> = {
  'Assets':       { Icon: FolderOpen, color: 'text-cabin-gold' },
  'Reports':      { Icon: FileText,   color: 'text-cabin-maroon' },
  'Case Studies': { Icon: BookMarked, color: 'text-cabin-flame' },
  'Playbook':     { Icon: Map,        color: 'text-purple-400' },
}

const TAB_CONTENT_TYPE: Record<Tab, string> = {
  'Assets':       'asset',
  'Reports':      'report',
  'Case Studies': 'case_study',
  'Playbook':     'playbook',
}

export default function AddFavoritesDrawer({ isOpen, onClose, favorites, onAdd }: AddFavoritesDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('Assets')
  const [items, setItems] = useState<DrawerItem[]>([])
  const [loading, setLoading] = useState(false)

  // Mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Fetch content per tab
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    setLoading(true)
    setItems([])

    const fetchFn =
      activeTab === 'Assets'       ? getAllAssets :
      activeTab === 'Reports'      ? getReports :
      activeTab === 'Case Studies' ? getCaseStudies :
      getAllPlaybookPages

    ;(fetchFn() as Promise<DrawerItem[]>).then((data) => {
      if (!cancelled) {
        setItems(data ?? [])
        setLoading(false)
      }
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [isOpen, activeTab])

  if (!mounted) return null

  function isAlreadyFavorited(item: DrawerItem): boolean {
    const id = activeTab === 'Playbook' ? item.slug?.current : item._id
    return favorites.some(f => f.content_id === id)
  }

  function buildPayload(item: DrawerItem) {
    if (activeTab === 'Playbook') {
      return {
        content_type: TAB_CONTENT_TYPE[activeTab],
        content_id: item.slug!.current,
        title: item.title,
        slug: item.slug!.current,
        url: null,
        popular: item.popular ?? false,
      }
    }
    if (activeTab === 'Case Studies') {
      return {
        content_type: TAB_CONTENT_TYPE[activeTab],
        content_id: item._id!,
        title: item.title,
        slug: item.slug?.current ?? null,
        url: item.slideUrl ?? null,
        popular: item.popular ?? false,
      }
    }
    return {
      content_type: TAB_CONTENT_TYPE[activeTab],
      content_id: item._id!,
      title: item.title,
      slug: item.slug?.current ?? null,
      url: null,
      popular: item.popular ?? false,
    }
  }

  const atCap = favorites.length >= 6

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-[99] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-[100] flex flex-col transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cabin-stone/10">
          <h2 className="font-geist font-semibold text-lg text-cabin-charcoal">Add a Bookmark</h2>
          <button onClick={onClose} className="text-cabin-stone hover:text-cabin-charcoal transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cabin-stone/10">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-2 py-3 text-xs font-inter font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-cabin-flame text-cabin-charcoal'
                  : 'text-cabin-stone hover:text-cabin-charcoal'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cap warning */}
        {atCap && (
          <p className="px-5 pt-3 pb-1 text-xs text-cabin-stone font-inter">
            6/6 saved — remove a bookmark to add more
          </p>
        )}

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {loading ? (
            <div className="space-y-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-9 rounded-xl bg-cabin-mauve/40 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="px-3 py-4 text-sm text-cabin-stone font-inter">No content found.</p>
          ) : (
            <div className="space-y-0.5">
              {items.map((item, i) => {
                const favorited = isAlreadyFavorited(item)
                const { Icon, color } = TAB_ICONS[activeTab]
                return (
                  <div
                    key={item._id ?? item.slug?.current ?? i}
                    onClick={favorited || atCap ? undefined : () => onAdd(buildPayload(item))}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      favorited
                        ? 'opacity-40 cursor-default'
                        : atCap
                        ? 'cursor-default'
                        : 'hover:bg-cabin-mauve/40 cursor-pointer'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                    <span className="font-inter text-sm text-cabin-charcoal flex-1 min-w-0 truncate">
                      {item.title}
                    </span>
                    {item.popular && (
                      <span className="flex items-center gap-0.5 flex-shrink-0">
                        <Users className="w-3 h-3 text-cabin-stone" />
                        <span className="text-[10px] text-cabin-stone">Popular</span>
                      </span>
                    )}
                    {favorited && (
                      <Bookmark className="w-4 h-4 flex-shrink-0 text-cabin-maroon" fill="currentColor" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
