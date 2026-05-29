import fetch from 'node-fetch'

// Static account metadata — matched by name via META_ACCOUNT_ORDER
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

const EMPTY_META = {
  spend: 0, impressions: 0, clicks: 0, conversions: 0,
  revenue: 0, pageViews: 0, addToCart: 0, checkout: 0, leads: 0,
}

export default async function handler(req, res) {
  const { since, until } = req.query

  if (!since || !until) {
    return res.status(400).json({ error: 'Missing required params: since, until' })
  }

  let accountIds, accountOrder
  try {
    accountIds   = JSON.parse(process.env.META_ACCOUNT_IDS   || '[]')
    accountOrder = JSON.parse(process.env.META_ACCOUNT_ORDER || '[]')
  } catch {
    return res.status(500).json({ error: 'Invalid META_ACCOUNT_IDS or META_ACCOUNT_ORDER' })
  }

  if (!accountIds.length) {
    return res.status(500).json({ error: 'META_ACCOUNT_IDS is empty' })
  }

  const proto   = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = `${proto}://${req.headers.host}`

  try {
    const results = await Promise.all(
      accountIds.map(id =>
        fetch(`${baseUrl}/api/meta?accountId=${id}&since=${since}&until=${until}`)
          .then(r => r.json())
      )
    )

    const accounts = results.map((meta, i) => {
      const name = accountOrder[i]
      const cfg  = ACCOUNTS_CONFIG.find(a => a.name === name)
             || { id: i + 1, name: name || `Conta ${i + 1}`, type: 'pizza', color: '#888888', budget: 0 }

      const m = (meta && !meta.error) ? meta : EMPTY_META

      return {
        ...cfg,
        meta: { ...m, orders: m.conversions },
        google: GOOGLE_ZERO,
      }
    })

    return res.json(accounts)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
