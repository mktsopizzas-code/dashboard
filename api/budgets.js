import fetch from 'node-fetch'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

const headers = () => ({
  'apikey':        SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type':  'application/json',
})

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const { since, until } = req.query
    let url = `${SUPABASE_URL}/rest/v1/budgets?select=account_id,account_name,budget,period_start,period_end`
    if (since) url += `&period_start=eq.${since}`
    if (until) url += `&period_end=eq.${until}`

    const r    = await fetch(url, { headers: headers() })
    const data = await r.json()
    if (!r.ok) return res.status(r.status).json(data)
    return res.json(data)
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { account_id, account_name, budget, period_start, period_end } = body

    const r = await fetch(`${SUPABASE_URL}/rest/v1/budgets`, {
      method:  'POST',
      headers: { ...headers(), 'Prefer': 'resolution=merge-duplicates' },
      body:    JSON.stringify({ account_id, account_name, budget, period_start, period_end }),
    })

    if (!r.ok) {
      const err = await r.json()
      return res.status(r.status).json(err)
    }
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
