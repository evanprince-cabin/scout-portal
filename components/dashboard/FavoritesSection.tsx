'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
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

  async function handleAdd(item: { content_type: string; content_id: string; title: string; slug: string | null; url: string | null }) {
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
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-cabin-stone">
          Favorites
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-cabin-maroon text-white rounded-full text-xs px-3 py-1 font-inter hover:bg-cabin-charcoal transition-colors"
        >
          + Add
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center">
          <Bookmark className="w-5 h-5 text-cabin-stone/50" />
          <p className="text-sm text-cabin-stone font-inter">Pin your most-used content here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {favorites.map(fav => (
            <FavoriteCard
              key={fav.id}
              id={fav.id}
              title={fav.title}
              content_type={fav.content_type as 'asset' | 'report' | 'case_study' | 'playbook'}
              slug={fav.slug}
              url={fav.url}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <AddFavoritesDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        favorites={favorites}
        onAdd={handleAdd}
      />
    </section>
  )
}
