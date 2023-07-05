import { serverSupabaseClient } from '#supabase/server'

export default async function handler(req: any, res: any) {
  const client = serverSupabaseClient(req)
  const { data, error } = await client.from('health_metrics').select('id', { count: 'exact' })

  if (error) {
    console.error('Error pinging Supabase:', error)
    return res.status(500).json({ error: 'Failed to ping Supabase' })
  }

  return res.json({ message: 'Successfully pinged Supabase', count: data.length })
}
