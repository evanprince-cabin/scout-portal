import { createServerClient } from '@/lib/supabase/server'

export async function getReferralStats(scoutId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('referrals')
    .select('status')
    .eq('scout_id', scoutId)

  if (error || !data) {
    return { submitted: 0, active: 0, closedWon: 0 }
  }

  const activeStatuses = ['submitted', 'contacted', 'in_conversations', 'proposal_sent']

  return {
    submitted: data.length,
    active: data.filter((r) => activeStatuses.includes(r.status)).length,
    closedWon: data.filter((r) => r.status === 'closed_won').length,
  }
}
