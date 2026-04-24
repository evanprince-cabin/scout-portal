import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function PATCH() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: { hasSeenWelcome: true },
  })

  return NextResponse.json({ success: true })
}
