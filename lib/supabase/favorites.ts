import { createServerClient } from '@/lib/supabase/server'

export interface Favorite {
  id: string
  scout_id: string
  content_type: string
  content_id: string
  title: string
  slug: string | null
  url: string | null
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
  payload: { content_type: string; content_id: string; title: string; slug: string | null; url: string | null }
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

export async function removeFavorite(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from('favorites').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
