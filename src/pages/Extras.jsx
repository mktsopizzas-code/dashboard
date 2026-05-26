import { useState } from 'react'
import { HOURLY, UTM_DATA } from '../data.js'
import { platformSplit, cprColor, roasColor, ctrColor } from '../utils.js'

const TABS = ['Pico por Horário', 'Meta vs Google', 'UTMs']

/* ── Aba 1: Pico por Horário ──────────────────────────── */
function TabHourly() {
  const maxVal = Math.max(...HOURLY.flatMap(h => [h.pizza, h.burger]))

  const hr = h => parseInt(h.hour)
  const noturno  = HOURLY.filter(h => hr(h) >= 19 && hr(h) <= 22)
  const ocioso   = HOURLY.filter(h => hr(h) >= 15 && hr(h) <= 17)
  const melhor   = HOURLY.reduce((best, h) =>
    (h.pizza + h.burger) > (best.pizza + best.burger) ? h : best, HOURLY[0])

  const noturnoTotal = noturno.reduce((s, h) => s + h.pizza + h.burger, 0)
  const ociosoTotal  = ocioso.reduce((s, h) => s + h.pizza + h.burger, 0)

  return (
    <div>
      <div className="hour-legend">
        <div className="hour-legend-item">
          <div className="legend-dot" style={{ background: '#E85D26' }} />
          Pizzarias
        </div>
        <div className="hour-legend-item">
          <div className="legend-dot" style={{ background: '#6A8ECC' }} />
          Hamburguerias
        </div>
      </div>

      <div className="hour-chart">
        {HOURLY.map(h => (
          <div key={h.hour} className="h-bar-wrap">
            <div className="h-bars">
              <div
                className="h-bar"
                style={{
                  height: `${(h.pizza  / maxVal) * 100}%`,
                  background: '#E85D26',
                }}
              />
              <div
                className="h-bar"
                style={{
                  height: `${(h.burger / maxVal) * 100}%`,
                  background: '#6A8ECC',
                }}
              />
            </div>
            <div className="h-label">{h.hour}</div>
          </div>
        ))}
      </div>

      <div className="hour-highlights">
        <div className="hour-highlight-card">
          <div className="hour-highlight-label">Pico Noturno (19h–22h)</div>
          <div className="hour-highlight-val">{noturnoTotal}</div>
          <div className="hour-highlight-sub">conversões no período</div>
        </div>
        <div className="hour-highlight-card">
          <div className="hour-highlight-label">Melhor Horário</div>
          <div className="hour-highlight-val">{melhor.hour}</div>
          <div className="hour-highlight-sub">{melhor.pizza + melhor.burger} conversões</div>
        </div>
        <div className="hour-highlight-card">
          <div className="hour-highlight-label">Período Ocioso (15h–17h)</div>
          <div className="hour-highlight-val">{ociosoTotal}</div>
          <div className="hour-highlight-sub">conversões no período</div>
        </div>
      </div>
    </div>
  )
}

/* ── Aba 2: Meta vs Google ────────────────────────────── */
function TabPlatform({ accounts }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 10, color: '#4A5060', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          <span style={{ width: 140 }}>Conta</span>
          <span style={{ flex: 1 }}>Split de Gasto</span>
          <span style={{ width: 100, textAlign: 'right' }}>Meta / Google</span>
        </div>
        {accounts.map(acc => {
          const s = platformSplit(acc)
          return (
            <div key={acc.id} className="platform-split-row">
              <div className="platform-split-name">
                <span className="dot" style={{ background: acc.color, width: 8, height: 8 }} />
                {acc.name}
              </div>
              <div className="platform-split-bar-wrap">
                <div className="platform-split-meta"   style={{ width: `${s.metaPct}%`   }} />
                <div className="platform-split-google" style={{ width: `${s.googlePct}%` }} />
              </div>
              <div className="platform-split-labels">
                <span style={{ color: '#6A8ECC' }}>{s.metaPct.toFixed(0)}%</span>
                <span style={{ color: '#4ECB8D' }}>{s.googlePct.toFixed(0)}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="section-title">CTR e ROAS por Plataforma</div>
      <div className="platform-detail-grid">
        <div className="kpi-card">
          <div className="kpi-label" style={{ color: '#6A8ECC' }}>Meta CTR</div>
          {accounts.map(acc => {
            const s = platformSplit(acc)
            return (
              <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                <span style={{ color: '#8A94A6', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className="dot" style={{ background: acc.color, width: 6, height: 6 }} />{acc.name}
                </span>
                <span className="mono" style={{ color: ctrColor(s.metaCTR) }}>{s.metaCTR.toFixed(2)}%</span>
              </div>
            )
          })}
        </div>
        <div className="kpi-card">
          <div className="kpi-label" style={{ color: '#4ECB8D' }}>Google CTR</div>
          {accounts.map(acc => {
            const s = platformSplit(acc)
            return (
              <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                <span style={{ color: '#8A94A6', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className="dot" style={{ background: acc.color, width: 6, height: 6 }} />{acc.name}
                </span>
                <span className="mono" style={{ color: ctrColor(s.googleCTR) }}>{s.googleCTR.toFixed(2)}%</span>
              </div>
            )
          })}
        </div>
        <div className="kpi-card">
          <div className="kpi-label" style={{ color: '#6A8ECC' }}>Meta ROAS</div>
          {accounts.map(acc => {
            const s = platformSplit(acc)
            return (
              <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                <span style={{ color: '#8A94A6', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className="dot" style={{ background: acc.color, width: 6, height: 6 }} />{acc.name}
                </span>
                <span className="mono" style={{ color: roasColor(s.metaROAS) }}>{s.metaROAS.toFixed(2)}x</span>
              </div>
            )
          })}
        </div>
        <div className="kpi-card">
          <div className="kpi-label" style={{ color: '#4ECB8D' }}>Google ROAS</div>
          {accounts.map(acc => {
            const s = platformSplit(acc)
            return (
              <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                <span style={{ color: '#8A94A6', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span className="dot" style={{ background: acc.color, width: 6, height: 6 }} />{acc.name}
                </span>
                <span className="mono" style={{ color: roasColor(s.googleROAS) }}>{s.googleROAS.toFixed(2)}x</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Aba 3: UTMs ──────────────────────────────────────── */
function TabUTMs() {
  return (
    <div className="utm-wrap">
      <table className="utm-table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Source</th>
            <th>Cliques</th>
            <th>Conversões</th>
            <th>CPR</th>
          </tr>
        </thead>
        <tbody>
          {UTM_DATA.map((row, i) => (
            <tr key={i}>
              <td>{row.campaign}</td>
              <td>
                <span className={`tag tag-${row.source === 'google' ? 'google' : 'meta'}`}>
                  {row.source === 'google' ? 'Google' : 'Meta'}
                </span>
              </td>
              <td className="mono">{row.clicks.toLocaleString('pt-BR')}</td>
              <td className="mono">{row.conv}</td>
              <td className="mono" style={{ color: cprColor(row.cpr) }}>
                R$ {row.cpr.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Extras ───────────────────────────────────────────── */
export default function Extras({ accounts }) {
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

      {tab === 0 && <TabHourly />}
      {tab === 1 && <TabPlatform accounts={accounts} />}
      {tab === 2 && <TabUTMs />}
    </div>
  )
}
