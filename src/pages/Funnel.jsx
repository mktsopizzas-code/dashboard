import { useState } from 'react'
import { funnelStages, funnelRates, funnelBottleneck, funnelColor, funnelRate, fmtN } from '../utils.js'

const TABS = ['Por Conta', 'Comparativo']

const BOTTLENECK_LABEL = {
  imp_click:  'Imp → Clique',
  click_lead: 'Clique → Lead',
  lead_order: 'Lead → Pedido',
}

/* ── Aba 1: Por Conta ─────────────────────────────────── */
function TabByConta({ accounts }) {
  const [accIdx, setAccIdx] = useState(0)
  const acc    = accounts[accIdx]
  const stages = funnelStages(acc)
  const rates  = funnelRates(acc)
  const neck   = funnelBottleneck(acc)
  const top    = stages[0].value

  const rateList = [
    { key: 'imp_click',  label: 'Imp → Clique', value: rates.impToClick  },
    { key: 'click_lead', label: 'Clique → Lead', value: rates.clickToLead },
    { key: 'lead_order', label: 'Lead → Pedido', value: rates.leadToOrder },
  ]

  return (
    <div>
      {/* Account selector */}
      <div className="funnel-account-select">
        {accounts.map((a, i) => (
          <div
            key={a.id}
            className={`tab${accIdx === i ? ' active' : ''}`}
            onClick={() => setAccIdx(i)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span className="dot" style={{ background: a.color, width: 8, height: 8 }} />
            {a.name}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Funnel visual */}
        <div className="funnel-card">
          <div className="funnel-account-name">
            <span className="dot" style={{ background: acc.color, width: 10, height: 10 }} />
            {acc.name}
          </div>

          <div className="funnel-stages">
            {stages.map((stage, i) => {
              const widthPct = top > 0 ? Math.max((stage.value / top) * 100, 8) : 8
              const rateEntry = rateList[i - 1]
              const isNeck = rateEntry && rateEntry.key === neck

              return (
                <div key={stage.label} className="funnel-stage">
                  {i > 0 && (
                    <div className="funnel-connector">
                      <span
                        className="funnel-rate"
                        style={{ color: funnelColor(rateList[i - 1].value) }}
                      >
                        {rateList[i - 1].value.toFixed(1)}%
                      </span>
                      <div className="funnel-connector-line" />
                      {isNeck && (
                        <span className="badge badge-err" style={{ fontSize: 10, padding: '2px 8px' }}>
                          Gargalo
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                      className="funnel-stage-bar"
                      style={{
                        width: `${widthPct}%`,
                        background: acc.color + (i === 0 ? 'CC' : i === 1 ? '99' : i === 2 ? '66' : '44'),
                        border: isNeck ? `2px solid ${acc.color}` : 'none',
                      }}
                    >
                      <span className="funnel-stage-label">{stage.label}</span>
                      <span className="funnel-stage-val">{fmtN(stage.value)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="funnel-bottleneck">
            <span>⚠</span>
            <span>Gargalo: <strong>{BOTTLENECK_LABEL[neck]}</strong></span>
          </div>
        </div>

        {/* Meta vs Google breakdown */}
        <div className="funnel-card">
          <div className="funnel-account-name">Breakdown por Plataforma</div>
          <div className="funnel-platform-split">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                gap: '6px 10px',
                fontSize: 11,
                marginBottom: 8,
              }}
            >
              <span style={{ color: '#4A5060', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.06em' }}>Etapa</span>
              <span style={{ color: '#6A8ECC', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.06em' }}>Meta</span>
              <span style={{ color: '#4ECB8D', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.06em' }}>Google</span>
            </div>
            {stages.map(stage => (
              <div
                key={stage.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 1fr',
                  gap: '6px 10px',
                  padding: '8px 0',
                  borderBottom: '1px solid #1E2228',
                  alignItems: 'center',
                }}
              >
                <span className="funnel-platform-stage">{stage.label}</span>
                <span className="funnel-platform-val" style={{ color: '#6A8ECC' }}>
                  {fmtN(stage.metaValue)}
                </span>
                <span className="funnel-platform-val" style={{ color: '#4ECB8D' }}>
                  {fmtN(stage.googleValue)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="section-title">Taxas de conversão</div>
            {rateList.map(r => (
              <div
                key={r.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #1E2228',
                  fontSize: 13,
                }}
              >
                <span style={{ color: '#8A94A6' }}>{r.label}</span>
                <span
                  className="mono"
                  style={{ color: funnelColor(r.value), fontWeight: 500 }}
                >
                  {r.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Aba 2: Comparativo ───────────────────────────────── */
function TabComparativo({ accounts }) {
  const allRates = accounts.map(acc => ({ acc, rates: funnelRates(acc), neck: funnelBottleneck(acc) }))

  const bestImpClick  = Math.max(...allRates.map(r => r.rates.impToClick))
  const bestClickLead = Math.max(...allRates.map(r => r.rates.clickToLead))
  const bestLeadOrder = Math.max(...allRates.map(r => r.rates.leadToOrder))

  return (
    <div>
      <table className="funnel-compare-table">
        <thead>
          <tr>
            <th style={{ paddingBottom: 10 }}>Conta</th>
            <th style={{ paddingBottom: 10 }}>Imp → Clique</th>
            <th style={{ paddingBottom: 10 }}>Clique → Lead</th>
            <th style={{ paddingBottom: 10 }}>Lead → Pedido</th>
            <th style={{ paddingBottom: 10 }}>Gargalo</th>
          </tr>
        </thead>
        <tbody>
          {allRates.map(({ acc, rates, neck }) => {
            const isBestIC = rates.impToClick  === bestImpClick
            const isBestCL = rates.clickToLead === bestClickLead
            const isBestLO = rates.leadToOrder === bestLeadOrder

            return (
              <tr key={acc.id}>
                <td>
                  <span className="dot" style={{ background: acc.color, width: 8, height: 8 }} />
                  <span style={{ fontSize: 13, color: '#C0C8D8' }}>{acc.name}</span>
                </td>
                <td>
                  <span
                    className="mono"
                    style={{
                      color: funnelColor(rates.impToClick),
                      background: isBestIC ? '#0A1F15' : 'transparent',
                      padding: isBestIC ? '2px 8px' : '0',
                      borderRadius: isBestIC ? 4 : 0,
                    }}
                  >
                    {rates.impToClick.toFixed(1)}%
                  </span>
                </td>
                <td>
                  <span
                    className="mono"
                    style={{
                      color: funnelColor(rates.clickToLead),
                      background: isBestCL ? '#0A1F15' : 'transparent',
                      padding: isBestCL ? '2px 8px' : '0',
                      borderRadius: isBestCL ? 4 : 0,
                    }}
                  >
                    {rates.clickToLead.toFixed(1)}%
                  </span>
                </td>
                <td>
                  <span
                    className="mono"
                    style={{
                      color: funnelColor(rates.leadToOrder),
                      background: isBestLO ? '#0A1F15' : 'transparent',
                      padding: isBestLO ? '2px 8px' : '0',
                      borderRadius: isBestLO ? 4 : 0,
                    }}
                  >
                    {rates.leadToOrder.toFixed(1)}%
                  </span>
                </td>
                <td>
                  <span className="badge badge-warn" style={{ fontSize: 10 }}>
                    {BOTTLENECK_LABEL[neck]}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ── Funnel ───────────────────────────────────────────── */
export default function Funnel({ accounts }) {
  const [tab, setTab] = useState(0)

  return (
    <div>
      <div className="tab-bar">
        {TABS.map((t, i) => (
          <div
            key={t}
            className={`tab${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </div>
        ))}
      </div>

      {tab === 0 && <TabByConta    accounts={accounts} />}
      {tab === 1 && <TabComparativo accounts={accounts} />}
    </div>
  )
}
