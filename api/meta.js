export default async function handler(req, res) {
  const { accountId, since, until } = req.query

  if (!accountId || !since || !until) {
    return res.status(400).json({ error: 'Missing required params: accountId, since, until' })
  }

  const token = process.env.META_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'META_TOKEN not configured' })
  }

  const fields = 'spend,impressions,inline_link_clicks,actions,action_values,landing_page_views'
  const url    = new URL(`https://graph.facebook.com/v19.0/act_${accountId}/insights`)
  url.searchParams.set('fields',     fields)
  url.searchParams.set('time_range', JSON.stringify({ since, until }))
  url.searchParams.set('access_token', token)

  try {
    const resp = await fetch(url.toString())
    const json = await resp.json()

    if (json.error) {
      return res.status(500).json({ error: json.error.message })
    }

    const data = json.data?.[0]
    if (!data) {
      return res.json({ spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0, pageViews: 0, addToCart: 0 })
    }

    const findAction = (type) => {
      const item = (data.actions || []).find(a => a.action_type === type)
      return item ? parseFloat(item.value) : 0
    }
    const findValue = (type) => {
      const item = (data.action_values || []).find(a => a.action_type === type)
      return item ? parseFloat(item.value) : 0
    }

    return res.json({
      spend:       parseFloat(data.spend || 0),
      impressions: parseInt(data.impressions || 0, 10),
      clicks:      parseInt(data.inline_link_clicks || 0, 10),
      conversions: findAction('purchase') || findAction('offsite_conversion.fb_pixel_purchase'),
      revenue:     findValue('purchase')  || findValue('offsite_conversion.fb_pixel_purchase'),
      pageViews:   parseInt(data.landing_page_views || 0, 10) || findAction('landing_page_view'),
      addToCart:   findAction('add_to_cart'),
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
