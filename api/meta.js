import fetch from 'node-fetch'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { accountId, since, until } = req.query
  const token = process.env.META_TOKEN

  const fields = [
    'spend', 'impressions', 'clicks',
    'actions', 'action_values',
    'landing_page_views',
  ].join(',')

  const url = `https://graph.facebook.com/v19.0/act_${accountId}/insights` +
    `?fields=${fields}` +
    `&time_range={"since":"${since}","until":"${until}"}` +
    `&access_token=${token}`

  try {
    const response = await fetch(url)
    const json     = await response.json()

    if (json.error) {
      return res.status(400).json({ error: json.error.message })
    }

    const d = json.data?.[0]
    if (!d) return res.status(200).json(null)

    const getAction = (type) =>
      d.actions?.find(a => a.action_type === type)?.value || 0
    const getActionValue = (type) =>
      d.action_values?.find(a => a.action_type === type)?.value || 0

    return res.status(200).json({
      spend:       parseFloat(d.spend || 0),
      impressions: parseInt(d.impressions || 0),
      clicks:      parseInt(d.clicks || 0),
      conversions: parseInt(getAction('purchase')           || getAction('omni_purchase')),
      revenue:     parseFloat(getActionValue('purchase')    || getActionValue('omni_purchase')),
      pageViews:   parseInt(d.landing_page_views || 0),
      addToCart:   parseInt(getAction('add_to_cart')        || getAction('omni_add_to_cart')),
      checkout:    parseInt(getAction('initiate_checkout')  || getAction('omni_initiated_checkout')),
      leads:       parseInt(getAction('lead')),
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
