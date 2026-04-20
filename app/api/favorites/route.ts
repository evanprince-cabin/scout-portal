import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getFavorites, addFavorite } from '@/lib/supabase/favorites'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const favorites = await getFavorites(userId)
  return NextResponse.json(favorites)
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await getFavorites(userId)
  if (existing.length >= 6) {
    return NextResponse.json({ error: 'Favorite limit reached' }, { status: 400 })
  }

  const body = await request.json()
  const { content_type, content_id, title, slug, url, popular } = body

  try {
    const favorite = await addFavorite(userId, { content_type, content_id, title, slug: slug ?? null, url: url ?? null, popular: popular ?? false })
    return NextResponse.json(favorite, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
