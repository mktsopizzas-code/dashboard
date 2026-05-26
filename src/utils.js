export function calc(acc) {
  const spend  = acc.meta.spend + acc.google.spend
  const imp    = acc.meta.impressions + acc.google.impressions
  const clicks = acc.meta.clicks + acc.google.clicks
  const conv   = acc.meta.conversions + acc.google.conversions
  const rev    = acc.meta.revenue + acc.google.revenue
  const leads  = acc.meta.leads + acc.google.leads
  const orders = acc.meta.orders + acc.google.orders

  const ctr  = imp   > 0 ? (clicks / imp) * 100 : 0
  const cpc  = clicks > 0 ? spend / clicks       : 0
  const cpr  = conv  > 0 ? spend / conv           : 0
  const roas = spend > 0 ? rev / spend            : 0

  return { spend, imp, clicks, conv, rev, ctr, cpc, cpr, roas, leads, orders }
}

export function fmtBRL(n) {
  return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtN(n) {
  return Number(n).toLocaleString('pt-BR')
}

export function ctrColor(v) {
  if (v >= 4) return '#4ECB8D'
  if (v >= 3) return '#FF8C42'
  return '#FF5A5A'
}

export function cprColor(v) {
  if (v <= 18) return '#4ECB8D'
  if (v <= 24) return '#FF8C42'
  return '#FF5A5A'
}

export function roasColor(v) {
  if (v >= 4) return '#4ECB8D'
  if (v >= 2) return '#FF8C42'
  return '#FF5A5A'
}

export function funnelRate(a, b) {
  if (!a || a === 0) return '0.0%'
  return ((b / a) * 100).toFixed(1) + '%'
}

export function funnelColor(v) {
  if (v >= 10) return '#4ECB8D'
  if (v >= 5)  return '#FF8C42'
  return '#FF5A5A'
}

export function funnelStages(acc) {
  return [
    {
      label: 'Impressões',
      value: acc.meta.impressions + acc.google.impressions,
      metaValue: acc.meta.impressions,
      googleValue: acc.google.impressions,
    },
    {
      label: 'Cliques',
      value: acc.meta.clicks + acc.google.clicks,
      metaValue: acc.meta.clicks,
      googleValue: acc.google.clicks,
    },
    {
      label: 'Leads',
      value: acc.meta.leads + acc.google.leads,
      metaValue: acc.meta.leads,
      googleValue: acc.google.leads,
    },
    {
      label: 'Pedidos',
      value: acc.meta.orders + acc.google.orders,
      metaValue: acc.meta.orders,
      googleValue: acc.google.orders,
    },
  ]
}

export function funnelRates(acc) {
  const imp    = acc.meta.impressions + acc.google.impressions
  const clicks = acc.meta.clicks      + acc.google.clicks
  const leads  = acc.meta.leads       + acc.google.leads
  const orders = acc.meta.orders      + acc.google.orders

  return {
    impToClick:   imp    > 0 ? (clicks / imp)    * 100 : 0,
    clickToLead:  clicks > 0 ? (leads  / clicks) * 100 : 0,
    leadToOrder:  leads  > 0 ? (orders / leads)  * 100 : 0,
  }
}

export function funnelBottleneck(acc) {
  const r = funnelRates(acc)
  if (r.impToClick <= r.clickToLead && r.impToClick <= r.leadToOrder) return 'imp_click'
  if (r.clickToLead <= r.leadToOrder) return 'click_lead'
  return 'lead_order'
}

export function platformSplit(acc) {
  const totalSpend = acc.meta.spend + acc.google.spend
  const metaPct    = totalSpend > 0 ? (acc.meta.spend   / totalSpend) * 100 : 0
  const googlePct  = totalSpend > 0 ? (acc.google.spend / totalSpend) * 100 : 0

  const metaCTR    = acc.meta.impressions   > 0 ? (acc.meta.clicks   / acc.meta.impressions)   * 100 : 0
  const googleCTR  = acc.google.impressions > 0 ? (acc.google.clicks / acc.google.impressions) * 100 : 0
  const metaROAS   = acc.meta.spend   > 0 ? acc.meta.revenue   / acc.meta.spend   : 0
  const googleROAS = acc.google.spend > 0 ? acc.google.revenue / acc.google.spend : 0

  return { metaPct, googlePct, metaCTR, googleCTR, metaROAS, googleROAS }
}

export function detailFunnelStages(acc) {
  const pageViews = (acc.meta.pageViews  || 0) + (acc.google.pageViews  || 0)
  const addToCart = (acc.meta.addToCart  || 0) + (acc.google.addToCart  || 0)
  return [
    { label: 'Impressões',  value: acc.meta.impressions + acc.google.impressions, pending: false },
    { label: 'Cliques',     value: acc.meta.clicks      + acc.google.clicks,      pending: false },
    { label: 'Page Views',  value: pageViews,                                     pending: false },
    { label: 'Add to Cart', value: addToCart,                                     pending: addToCart === 0 },
    { label: 'Compras',     value: acc.meta.conversions + acc.google.conversions, pending: false },
  ]
}

export function detailFunnelRates(stages) {
  return stages.map((stage, i) => {
    if (i === 0) return null
    if (stage.pending || stages[i - 1].pending || stages[i - 1].value === 0) return null
    return (stage.value / stages[i - 1].value) * 100
  })
}

export function detailFunnelBottleneck(stages) {
  let minRate = Infinity
  let idx = -1
  for (let i = 1; i < stages.length; i++) {
    if (stages[i].pending || stages[i - 1].pending || stages[i - 1].value === 0) continue
    const rate = (stages[i].value / stages[i - 1].value) * 100
    if (rate < minRate) { minRate = rate; idx = i }
  }
  return idx
}

export function pacingStatus(spend, budget, currentDay, daysInMonth) {
  const projection = (spend / currentDay) * daysInMonth
  const pct = (spend / budget) * 100
  if (projection > budget * 1.1)  return { label: 'Acima',    color: '#FF5A5A', pct }
  if (projection < budget * 0.85) return { label: 'Abaixo',   color: '#FF8C42', pct }
  return                                  { label: 'No ritmo', color: '#4ECB8D', pct }
}
