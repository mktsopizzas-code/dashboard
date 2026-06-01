import fetch from 'node-fetch'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { accountId, since, until } = req.query
  const token = process.env.META_TOKEN

  console.log('META API CALL:', {
    accountId,
    since,
    until,
    hasToken: !!token,
    tokenPrefix: token?.substring(0, 20),
  })

  const fields = [
    'spend', 'impressions', 'clicks', 'inline_link_clicks',
    'actions', 'action_values',
  ].join(',')

  const url = `https://graph.facebook.com/v19.0/act_${accountId}/insights` +
    `?fields=${fields}` +
    `&time_range={"since":"${since}","until":"${until}"}` +
    `&filtering=${encodeURIComponent(JSON.stringify([{"field":"campaign.objective","operator":"IN","value":["OUTCOME_SALES","CONVERSIONS","PRODUCT_CATALOG_SALES"]}]))}` +
    `&access_token=${token}`

  try {
    const response = await fetch(url)
    const json     = await response.json()

    console.log('META API RESPONSE:', JSON.stringify(json, null, 2))

    if (json.error) {
      return res.status(400).json({
        error: json.error.message,
        code:  json.error.code,
        type:  json.error.type,
        full:  json.error,
      })
    }

    const d = json.data?.[0]
    if (!d) return res.status(200).json(null)

    const getAction = (type) => {
      const found = d.actions?.find(a => a.action_type === type)
      return found ? parseFloat(found.value) : 0
    }

    const conversions =
      getAction('purchase') ||
      getAction('omni_purchase') ||
      getAction('complete_registration') ||
      getAction('lead') ||
      getAction('offsite_conversion.fb_pixel_purchase') ||
      0

    const revenue = parseFloat(
      d.action_values?.find(a =>
        a.action_type === 'purchase' ||
        a.action_type === 'omni_purchase' ||
        a.action_type === 'offsite_conversion.fb_pixel_purchase'
      )?.value || 0
    )

    const pageViews =
      getAction('landing_page_view') ||
      getAction('link_click') ||
      0

    const addToCart =
      getAction('add_to_cart') ||
      getAction('omni_add_to_cart') ||
      getAction('offsite_conversion.fb_pixel_add_to_cart') ||
      0

    return res.status(200).json({
      spend:       parseFloat(d.spend || 0),
      impressions: parseInt(d.impressions || 0),
      clicks:      parseInt(d.inline_link_clicks || 0),
      conversions,
      revenue,
      pageViews,
      addToCart,
      checkout: getAction('initiate_checkout') || getAction('omni_initiated_checkout') || 0,
      leads:    getAction('lead') || 0,
      _raw: {
        spend:       d.spend,
        impressions: d.impressions,
        clicks:      d.clicks,
        actions:     d.actions,
        date_start:  d.date_start,
        date_stop:   d.date_stop,
      },
    })
  } catch (err) {
    console.log('META API ERROR:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
