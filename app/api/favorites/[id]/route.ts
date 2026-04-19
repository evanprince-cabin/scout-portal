import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { removeFavorite } from '@/lib/supabase/favorites'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await removeFavorite(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
