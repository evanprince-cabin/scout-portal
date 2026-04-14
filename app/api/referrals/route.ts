import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { prospect_name, company, email, phone, service_interest, notes } = body

  if (!prospect_name?.trim() || !company?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch scout's name from Clerk; fall back gracefully if lookup fails
  let scout_name = 'Unknown Scout'
  try {
    const user = await clerkClient.users.getUser(userId)
    const first = user.firstName ?? ''
    const last = user.lastName ?? ''
    scout_name = `${first} ${last}`.trim() || 'Unknown Scout'
  } catch (err) {
    console.error('Clerk user lookup failed:', err)
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      scout_id: userId,
      scout_name,
      prospect_name: prospect_name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      service_interest: service_interest || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send notification email — failure must never break the referral submission
  try {
    // TODO: confirm Cabin's verified sending domain in Resend and update the from address
    await resend.emails.send({
      from: 'Cabin Scout Portal <onboarding@resend.dev>',
      to: process.env.REFERRAL_NOTIFY_EMAIL!,
      subject: `New Referral: ${prospect_name.trim()} at ${company.trim()}`,
      html: `
        <h2>New Scout Referral</h2>
        <p><strong>Submitted by:</strong> ${scout_name}</p>
        <hr />
        <p><strong>Prospect:</strong> ${prospect_name.trim()}</p>
        <p><strong>Company:</strong> ${company.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Phone:</strong> ${phone?.trim() || 'Not provided'}</p>
        <p><strong>Service Interest:</strong> ${service_interest || 'Not specified'}</p>
        <p><strong>Notes:</strong> ${notes?.trim() || 'None'}</p>
        <hr />
        <p style="color: #888; font-size: 12px;">Submitted via the Cabin Scout Portal</p>
      `,
    })
  } catch (err) {
    console.error('Resend email failed:', err)
  }

  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('scout_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
