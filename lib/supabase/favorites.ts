import { createServerClient } from '@/lib/supabase/server'

export interface Favorite {
  id: string
  scout_id: string
  content_type: string
  content_id: string
  title: string
  slug: string | null
  url: string | null
  popular: boolean
  created_at: string
}

export async function getFavorites(scoutId: string): Promise<Favorite[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('scout_id', scoutId)
    .order('created_at', { ascending: true })
  if (error || !data) return []
  return data as Favorite[]
}

export async function addFavorite(
  scoutId: string,
  payload: { content_type: string; content_id: string; title: string; slug: string | null; url: string | null; popular: boolean }
): Promise<Favorite> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('favorites')
    .insert({ scout_id: scoutId, ...payload })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Favorite
}

const DEFAULT_FAVORITE = {
  content_type: 'playbook',
  content_id: 'cabin-capabilities-overview',
  title: 'Cabin Capabilities Overview',
  slug: 'cabin-capabilities-overview',
  url: null,
  popular: false,
}

export async function getFavoritesWithDefaults(scoutId: string): Promise<Favorite[]> {
  const favorites = await getFavorites(scoutId)
  if (favorites.length > 0) return favorites
  try {
    const seeded = await addFavorite(scoutId, DEFAULT_FAVORITE)
    return [seeded]
  } catch {
    return []
  }
}

export async function removeFavorite(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from('favorites').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
