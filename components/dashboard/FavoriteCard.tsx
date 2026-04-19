'use client'

import Link from 'next/link'
import { FolderOpen, FileText, BookMarked, Map, X } from 'lucide-react'

interface FavoriteCardProps {
  id: string
  title: string
  content_type: 'asset' | 'report' | 'case_study' | 'playbook'
  slug: string | null
  url: string | null
  onRemove: (id: string) => void
}

const TYPE_CONFIG = {
  asset:      { Icon: FolderOpen, color: 'text-cabin-gold' },
  report:     { Icon: FileText,   color: 'text-cabin-indigo' },
  case_study: { Icon: BookMarked, color: 'text-cabin-flame' },
  playbook:   { Icon: Map,        color: 'text-purple-400' },
}

export default function FavoriteCard({ id, title, content_type, slug, url, onRemove }: FavoriteCardProps) {
  const { Icon, color } = TYPE_CONFIG[content_type] ?? TYPE_CONFIG.asset

  const internalHref =
    content_type === 'asset'  ? '/assets' :
    content_type === 'report' ? `/reports/${slug}` :
    `/playbook/${slug}`

  const cardContent = (
    <>
      <div className="bg-cabin-mauve p-1.5 rounded-md w-fit">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="font-inter text-sm font-medium text-cabin-charcoal line-clamp-2 mt-1 pr-4">{title}</p>
    </>
  )

  return (
    <div className="relative bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md hover:border-cabin-stone/40 hover:-translate-y-0.5 transition-all duration-150">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2">
          {cardContent}
        </a>
      ) : (
        <Link href={internalHref} className="flex flex-col gap-2">
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
