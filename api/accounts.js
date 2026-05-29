// Static account metadata — order must match META_ACCOUNT_IDS
const ACCOUNTS_CONFIG = [
  { id: 1, name: 'Só Pizzas Ariquemes',   type: 'pizza',  color: '#E85D26', budget: 4000, smallMarket: true  },
  { id: 2, name: 'Só Pizzas Porto Velho', type: 'pizza',  color: '#E67E22', budget: 8200 },
  { id: 3, name: 'Só Pizzas Manaus',      type: 'pizza',  color: '#C0392B', budget: 8200 },
  { id: 4, name: 'Só Burger Porto Velho', type: 'burger', color: '#2C3E50', budget: 3000 },
  { id: 5, name: 'Só Burger Ariquemes',   type: 'burger', color: '#1A252F', budget: 3000, smallMarket: true  },
]

const GOOGLE_ZERO = {
  spend: 0, impressions: 0, clicks: 0, conversions: 0,
  revenue: 0, leads: 0, orders: 0, pageViews: 0, addToCart: 0, checkout: 0,
}

async function fetchMetrics(metaAccountId, token, since, until) {
  const fields = 'spend,impressions,inline_link_clicks,actions,action_values,landing_page_views'
  const url    = new URL(`https://graph.facebook.com/v19.0/act_${metaAccountId}/insights`)
  url.searchParams.set('fields',       fields)
  url.searchParams.set('time_range',   JSON.stringify({ since, until }))
  url.searchParams.set('access_token', token)

  const resp = await fetch(url.toString())
  const json = await resp.json()

  if (json.error) throw new Error(`[${metaAccountId}] ${json.error.message}`)

  const data = json.data?.[0]
  if (!data) return { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0, pageViews: 0, addToCart: 0 }

  const findAction = (type) => {
    const item = (data.actions || []).find(a => a.action_type === type)
    return item ? parseFloat(item.value) : 0
  }
  const findValue = (type) => {
    const item = (data.action_values || []).find(a => a.action_type === type)
    return item ? parseFloat(item.value) : 0
  }

  return {
    spend:       parseFloat(data.spend || 0),
    impressions: parseInt(data.impressions || 0, 10),
    clicks:      parseInt(data.inline_link_clicks || 0, 10),
    conversions: findAction('purchase') || findAction('offsite_conversion.fb_pixel_purchase'),
    revenue:     findValue('purchase')  || findValue('offsite_conversion.fb_pixel_purchase'),
    pageViews:   parseInt(data.landing_page_views || 0, 10) || findAction('landing_page_view'),
    addToCart:   findAction('add_to_cart'),
  }
}

export default async function handler(req, res) {
  const { since, until } = req.query

  if (!since || !until) {
    return res.status(400).json({ error: 'Missing required params: since, until' })
  }

  const token = process.env.META_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'META_TOKEN not configured' })
  }

  let accountIds
  try {
    accountIds = JSON.parse(process.env.META_ACCOUNT_IDS || '[]')
  } catch {
    return res.status(500).json({ error: 'Invalid META_ACCOUNT_IDS — must be a JSON array' })
  }

  if (!accountIds.length) {
    return res.status(500).json({ error: 'META_ACCOUNT_IDS is empty' })
  }

  try {
    const results = await Promise.all(
      accountIds.map(id => fetchMetrics(id, token, since, until))
    )

    const accounts = results.map((meta, i) => {
      const cfg = ACCOUNTS_CONFIG[i] || { id: i + 1, name: `Conta ${i + 1}`, type: 'pizza', color: '#888888', budget: 0 }
      return {
        ...cfg,
        meta: { ...meta, leads: 0, orders: meta.conversions, checkout: 0 },
        google: GOOGLE_ZERO,
      }
    })

    return res.json(accounts)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
