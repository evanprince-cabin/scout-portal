'use client'

import Link from 'next/link'
import { FolderOpen, FileText, BookMarked, Map, Users, X } from 'lucide-react'

interface FavoriteCardProps {
  id: string
  title: string
  content_type: 'asset' | 'report' | 'case_study' | 'playbook'
  slug: string | null
  url: string | null
  popular: boolean
  onRemove: (id: string) => void
}

const TYPE_CONFIG = {
  asset:      { Icon: FolderOpen, label: 'Asset' },
  report:     { Icon: FileText,   label: 'Report' },
  case_study: { Icon: BookMarked, label: 'Case Study' },
  playbook:   { Icon: Map,        label: 'Playbook page' },
}

export default function FavoriteCard({ id, title, content_type, slug, url, popular, onRemove }: FavoriteCardProps) {
  const { Icon, label } = TYPE_CONFIG[content_type] ?? TYPE_CONFIG.asset

  const internalHref =
    content_type === 'asset'  ? '/assets' :
    content_type === 'report' ? `/reports/${slug}` :
    `/playbook/${slug}`

  const cardContent = (
    <>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-cabin-stone" />
        <p className="font-inter text-xs text-cabin-stone">{label}</p>
      </div>
      <p className="font-geist font-semibold text-sm text-cabin-charcoal line-clamp-2">{title}</p>
      {popular && (
        <div className="flex items-center gap-1 text-xs text-cabin-stone mt-auto pt-2">
          <Users className="w-3 h-3" />
          <span>Popular with teammates</span>
        </div>
      )}
    </>
  )

  return (
    <div className="relative bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-4 flex flex-col gap-1.5 hover:shadow-md hover:border-cabin-stone/40 hover:-translate-y-0.5 transition-all duration-150">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1.5">
          {cardContent}
        </a>
      ) : (
        <Link href={internalHref} className="flex flex-col gap-1.5">
          {cardContent}
        </Link>
      )}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(id) }}
        className="absolute top-2 right-2 text-cabin-stone hover:text-cabin-maroon transition-colors"
        aria-label="Remove favorite"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
