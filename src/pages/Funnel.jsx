import { useState } from 'react'
import {
  detailFunnelStages, detailFunnelRates, detailFunnelBottleneck, detailFunnelCosts,
  detailFunnelRateColor, fmtBRL, fmtN,
} from '../utils.js'
import { FadeIn } from '../components/Motion.jsx'

const TABS = ['Por Conta', 'Comparativo']

const FUNNEL_LT     = [0,   78,  140, 182, 218]
const FUNNEL_LB     = [78,  140, 182, 218, 218]
const FUNNEL_RT     = [560, 482, 420, 378, 342]
const FUNNEL_RB     = [482, 420, 378, 342, 342]
const FUNNEL_TOP_OP = [1.00, 0.85, 0.70, 0.55, 0.40]
const FUNNEL_BOT_OP = [0.85, 0.70, 0.55, 0.40, 0.28]

const NECK_LABEL = ['', 'Clique→PV', 'PV→Cart', 'Cart→Checkout', 'Checkout→Compra']

/* ── Aba 1: Por Conta ─────────────────────────────────── */
function TabByConta({ accounts }) {
  const [accIdx, setAccIdx] = useState(0)
  const acc     = accounts[accIdx]
  const stages  = detailFunnelStages(acc)
  const rates   = detailFunnelRates(stages)
  const neckIdx = detailFunnelBottleneck(stages)
  const costs   = detailFunnelCosts(acc)

  const validRates = rates.filter(r => r !== null)
  const showNeck   = neckIdx !== -1 && validRates.length >= 2

  return (
    <div>
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

      {stages.map((stage, i) => {
        const lT     = FUNNEL_LT[i], rT = FUNNEL_RT[i]
        const lB     = FUNNEL_LB[i], rB = FUNNEL_RB[i]
        const rate   = rates[i]
        const cost   = costs[i]
        const midX   = 280
        const textLX = Math.round((lT + lB) / 2) + 16
        const textRX = Math.round((rT + rB) / 2) - 16
        const gId    = `fg-fn-${acc.id}-${i}`
        const cId    = `fc-fn-${acc.id}-${i}`

        return (
          <FadeIn key={`${acc.id}-${stage.label}`} delay={0.1 * (i + 1)}>
            <div className="detail-funnel-v-row">
              <div className="detail-funnel-v-left">
                {!stage.pending && cost != null ? fmtBRL(cost) : ''}
              </div>
              <div className="detail-funnel-v-center">
                <svg viewBox="0 0 560 64" width="560" height="64" style={{ display: 'block' }}>
                  <defs>
                    {!stage.pending && (
                      <linearGradient id={gId} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
                        <stop offset="0%"   stopColor={acc.color} stopOpacity={FUNNEL_TOP_OP[i]} />
                        <stop offset="100%" stopColor={acc.color} stopOpacity={FUNNEL_BOT_OP[i]} />
                      </linearGradient>
                    )}
                    <clipPath id={cId}>
                      <polygon points={`${lT},0 ${rT},0 ${rB},64 ${lB},64`} />
                    </clipPath>
                  </defs>
                  <polygon
                    points={`${lT},0 ${rT},0 ${rB},64 ${lB},64`}
                    fill={stage.pending ? '#1A1F28' : `url(#${gId})`}
                    stroke={stage.pending ? '#3A4050' : 'none'}
                    strokeWidth={stage.pending ? 1 : 0}
                    strokeDasharray={stage.pending ? '6 4' : undefined}
                  />
                  <g clipPath={`url(#${cId})`}>
                    {stage.pending ? (
                      <>
                        <text x={midX} y={24} fontSize="13" fontFamily="DM Sans, sans-serif"
                          fontWeight="600" fill="#4A5060" textAnchor="middle" dominantBaseline="middle">
                          {stage.label}
                        </text>
                        <text x={midX} y={44} fontSize="11" fontFamily="DM Sans, sans-serif"
                          fill="#4A5060" textAnchor="middle" dominantBaseline="middle">
                          dados em breve
                        </text>
                      </>
                    ) : (
                      <>
                        <text x={textLX} y={32} fontSize="13" fontFamily="DM Sans, sans-serif"
                          fontWeight="700" fill="#E8EAF0" dominantBaseline="middle">
                          {stage.label}
                        </text>
                        <text x={textRX} y={32} fontSize="14" fontFamily="Space Mono, monospace"
                          fill="#E8EAF0" textAnchor="end" dominantBaseline="middle">
                          {fmtN(stage.value)}
                        </text>
                      </>
                    )}
                  </g>
                </svg>
              </div>
              <div
                className="detail-funnel-v-right"
                style={{ color: i > 0 && rate != null ? detailFunnelRateColor(rate) : 'transparent' }}
              >
                {i > 0 && rate != null ? rate.toFixed(1) + '%' : ''}
              </div>
            </div>
          </FadeIn>
        )
      })}

      {showNeck && (
        <FadeIn delay={0.5}>
          <div className="detail-funnel-neck">
            <span>⚠</span>
            <span>
              Gargalo em <strong>{stages[neckIdx].label}</strong>
              {rates[neckIdx] != null && `: ${rates[neckIdx].toFixed(1)}% de conversão`}
            </span>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

/* ── Aba 2: Comparativo ───────────────────────────────── */
function TabComparativo({ accounts }) {
  const rows = accounts.map(acc => {
    const stages  = detailFunnelStages(acc)
    const rates   = detailFunnelRates(stages)
    const neckIdx = detailFunnelBottleneck(stages)
    return { acc, rates, neckIdx }
  })

  const validR1 = rows.map(r => r.rates[1]).filter(v => v != null)
  const validR2 = rows.map(r => r.rates[2]).filter(v => v != null)
  const validR3 = rows.map(r => r.rates[3]).filter(v => v != null)
  const validR4 = rows.map(r => r.rates[4]).filter(v => v != null)
  const bestR1  = validR1.length ? Math.max(...validR1) : null
  const bestR2  = validR2.length ? Math.max(...validR2) : null
  const bestR3  = validR3.length ? Math.max(...validR3) : null
  const bestR4  = validR4.length ? Math.max(...validR4) : null

  function rateCell(value, best) {
    if (value == null) return <span className="mono" style={{ color: '#4A5060' }}>—</span>
    const isBest = best != null && value === best
    return (
      <span
        className="mono"
        style={{
          color: detailFunnelRateColor(value),
          background: isBest ? '#0A1F15' : 'transparent',
          padding: isBest ? '2px 8px' : '0',
          borderRadius: isBest ? 4 : 0,
        }}
      >
        {value.toFixed(1)}%
      </span>
    )
  }

  return (
    <FadeIn>
      <div>
        <table className="funnel-compare-table">
          <thead>
            <tr>
              <th>Conta</th>
              <th>Clique→PV %</th>
              <th>PV→Cart %</th>
              <th>Cart→Checkout %</th>
              <th>Checkout→Compra %</th>
              <th>Gargalo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ acc, rates, neckIdx }) => (
              <tr key={acc.id}>
                <td>
                  <span className="dot" style={{ background: acc.color, width: 8, height: 8 }} />
                  <span style={{ fontSize: 13, color: '#C0C8D8' }}>{acc.name}</span>
                </td>
                <td>{rateCell(rates[1], bestR1)}</td>
                <td>{rateCell(rates[2], bestR2)}</td>
                <td>{rateCell(rates[3], bestR3)}</td>
                <td>{rateCell(rates[4], bestR4)}</td>
                <td>
                  {neckIdx !== -1
                    ? <span className="badge badge-warn" style={{ fontSize: 10 }}>{NECK_LABEL[neckIdx]}</span>
                    : <span className="mono" style={{ color: '#4A5060' }}>—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FadeIn>
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

      {tab === 0 && <TabByConta     accounts={accounts} />}
      {tab === 1 && <TabComparativo accounts={accounts} />}
    </div>
  )
}
