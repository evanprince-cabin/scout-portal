'use client'

import { useState } from 'react'
import { BookmarkPlus } from 'lucide-react'
import type { Favorite } from '@/lib/supabase/favorites'
import FavoriteCard from '@/components/dashboard/FavoriteCard'
import AddFavoritesDrawer from '@/components/dashboard/AddFavoritesDrawer'

interface FavoritesSectionProps {
  initialFavorites: Favorite[]
  scoutId: string
}

export default function FavoritesSection({ initialFavorites, scoutId }: FavoritesSectionProps) {
  const [favorites, setFavorites] = useState<Favorite[]>(initialFavorites)
  const [drawerOpen, setDrawerOpen] = useState(false)

  async function handleAdd(item: { content_type: string; content_id: string; title: string; slug: string | null; url: string | null; popular: boolean }) {
    const tempFav: Favorite = {
      id: 'temp-' + Math.random().toString(36).slice(2),
      scout_id: scoutId,
      ...item,
      created_at: new Date().toISOString(),
    }
    setFavorites(prev => [...prev, tempFav])

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (!res.ok) throw new Error()
      const realFav: Favorite = await res.json()
      setFavorites(prev => prev.map(f => f.id === tempFav.id ? realFav : f))
    } catch {
      setFavorites(prev => prev.filter(f => f.id !== tempFav.id))
    }
  }

  async function handleRemove(id: string) {
    setFavorites(prev => prev.filter(f => f.id !== id))
    try {
      await fetch(`/api/favorites/${id}`, { method: 'DELETE' })
    } catch {
      // silent fail — item already removed from UI
    }
  }

  return (
    <section>
      <span className="text-xs font-semibold uppercase tracking-widest text-cabin-stone mb-3 block">
        Bookmarks
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {favorites.map(fav => (
          <FavoriteCard
            key={fav.id}
            id={fav.id}
            title={fav.title}
            content_type={fav.content_type as 'asset' | 'report' | 'case_study' | 'playbook'}
            slug={fav.slug}
            url={fav.url}
            popular={fav.popular}
            onRemove={handleRemove}
          />
        ))}

        {favorites.length < 6 && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="bg-[#FDFDFD] border border-dashed border-cabin-stone/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-cabin-stone hover:bg-cabin-mauve/40 hover:border-cabin-stone/50 transition-all duration-150 cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span className="font-inter text-xs">Add bookmark</span>
          </button>
        )}
      </div>

      <AddFavoritesDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        favorites={favorites}
        onAdd={handleAdd}
      />
    </section>
  )
}
