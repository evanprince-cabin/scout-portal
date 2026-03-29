import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/reports')
  revalidatePath('/articles')
  revalidatePath('/playbook')
  revalidatePath('/assets')
  revalidatePath('/events')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
