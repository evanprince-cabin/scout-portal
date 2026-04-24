'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderOpen, FileText, BookMarked, Map } from 'lucide-react'
import type { Favorite } from '@/lib/supabase/favorites'

interface ReplaceBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  newItemTitle: string
  favorites: Favorite[]
  onReplace: (favoriteId: string) => Promise<void>
}

const TYPE_META: Record<string, { label: string; Icon: typeof FolderOpen; color: string }> = {
  asset:      { label: 'Asset',       Icon: FolderOpen,  color: 'text-cabin-gold' },
  report:     { label: 'Report',      Icon: FileText,    color: 'text-cabin-indigo' },
  case_study: { label: 'Case Study',  Icon: BookMarked,  color: 'text-cabin-flame' },
  playbook:   { label: 'Playbook',    Icon: Map,         color: 'text-purple-400' },
}

export default function ReplaceBookmarkModal({
  isOpen, onClose, newItemTitle, favorites, onReplace,
}: ReplaceBookmarkModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [replacingId, setReplacingId] = useState<string | null>(null)

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

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!mounted) return null

  async function handleSelect(favoriteId: string) {
    if (replacingId) return
    setReplacingId(favoriteId)
    await onReplace(favoriteId)
    setReplacingId(null)
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4 transition-opacity duration-300 ease-out bg-cabin-charcoal/80 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <h2 className="font-geist font-bold text-lg text-cabin-charcoal">
              Bookmark limit reached
            </h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-cabin-stone hover:text-cabin-charcoal transition-colors mt-0.5"
            >
              <X size={18} />
            </button>
          </div>
          <p className="font-inter text-sm text-cabin-stone mb-5">
            Select a bookmark to replace with{' '}
            <span className="font-semibold text-cabin-charcoal">{newItemTitle}</span>.
          </p>

          <div className="border-t border-cabin-stone/10 mb-3" />

          {/* Bookmark list */}
          <div className="space-y-0.5">
            {favorites.map((fav) => {
              const meta = TYPE_META[fav.content_type] ?? TYPE_META['asset']
              const { Icon, color, label } = meta
              const isLoading = replacingId === fav.id
              return (
                <button
                  key={fav.id}
                  onClick={() => handleSelect(fav.id)}
                  disabled={!!replacingId}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-150 ${
                    replacingId && !isLoading
                      ? 'opacity-40 cursor-default'
                      : 'hover:bg-cabin-mauve/40 cursor-pointer'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm text-cabin-charcoal truncate">{fav.title}</p>
                    <p className="font-inter text-xs text-cabin-stone">{label}</p>
                  </div>
                  {isLoading && (
                    <svg className="w-4 h-4 text-cabin-stone animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
