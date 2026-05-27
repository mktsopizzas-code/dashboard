import { CREATIVES, CURRENT_DAY, DAYS_IN_MONTH } from '../data.js'
import {
  calc, fmtBRL, fmtN, ctrColor, cprColor, roasColor,
  pacingStatus, platformSplit, funnelColor,
  detailFunnelStages, detailFunnelRates, detailFunnelBottleneck, detailFunnelCosts,
} from '../utils.js'

const BADGE_CLASS = { 'No ritmo': 'badge-ok', 'Abaixo': 'badge-warn', 'Acima': 'badge-err' }

export default function AccountDetail({ account, onBack }) {
  const m       = calc(account)
  const status  = pacingStatus(m.spend, account.budget, CURRENT_DAY, DAYS_IN_MONTH)
  const split   = platformSplit(account)
  const stages  = detailFunnelStages(account)
  const rates   = detailFunnelRates(stages)
  const neckIdx = detailFunnelBottleneck(stages)
  const costs   = detailFunnelCosts(account)

  const FUNNEL_L    = [0, 117, 143, 182, 208]
  const FUNNEL_R    = [520, 403, 377, 338, 312]
  const FUNNEL_OPAC = [0.9, 0.8, 0.7, 0.5, 0.6]

  const campaigns = [...CREATIVES]
    .filter(c => c.accountId === account.id)
    .sort((a, b) => a.cpr - b.cpr)

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>

      {/* Seção 1 — Header */}
      <div className="detail-back" onClick={onBack}>← Voltar</div>

      <div className="detail-header">
        <span className="dot" style={{ background: account.color, width: 12, height: 12 }} />
        <div>
          <div className="detail-header-name">{account.name}</div>
          <div className="detail-header-type">
            {account.type === 'pizza' ? 'Pizzaria' : 'Hamburgueria'}
          </div>
        </div>
        <div className="detail-header-right">
          <span className={`badge ${BADGE_CLASS[status.label]}`}>{status.label}</span>
          <span>Maio 2026 · Dia {CURRENT_DAY}/{DAYS_IN_MONTH}</span>
        </div>
      </div>

      {/* Seção 2 — KPI Bar */}
      <div className="kpi-grid-6">
        <div className="kpi-card">
          <div className="kpi-label">Investimento</div>
          <div className="kpi-val" style={{ fontSize: 16 }}>{fmtBRL(m.spend)}</div>
          <div className="kpi-trend">de {fmtBRL(account.budget)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Conversões</div>
          <div className="kpi-val" style={{ fontSize: 16 }}>{fmtN(m.conv)}</div>
          <div className="kpi-trend">pedidos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">CPR</div>
          <div className="kpi-val" style={{ fontSize: 16, color: cprColor(m.cpr) }}>
            {fmtBRL(m.cpr)}
          </div>
          <div className="kpi-trend">por conversão</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">ROAS</div>
          <div className="kpi-val" style={{ fontSize: 16, color: roasColor(m.roas) }}>
            {m.roas.toFixed(2)}x
          </div>
          <div className="kpi-trend">{fmtBRL(m.rev)} receita</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">CTR</div>
          <div className="kpi-val" style={{ fontSize: 16, color: ctrColor(m.ctr) }}>
            {m.ctr.toFixed(2)}%
          </div>
          <div className="kpi-trend">{fmtN(m.clicks)} cliques</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Impressões</div>
          <div className="kpi-val" style={{ fontSize: 16 }}>{fmtN(m.imp)}</div>
          <div className="kpi-trend">alcance total</div>
        </div>
      </div>

      {/* Seção 3 — Funil visual */}
      <div className="detail-section">
        <div className="detail-section-title">Funil de Conversão</div>
        <div className="detail-funnel-v">
          {stages.map((stage, i) => {
            const lT     = FUNNEL_L[i], rT = FUNNEL_R[i]
            const lB     = i < 4 ? FUNNEL_L[i + 1] : FUNNEL_L[i]
            const rB     = i < 4 ? FUNNEL_R[i + 1] : FUNNEL_R[i]
            const rate   = rates[i]
            const cost   = costs[i]
            const isNeck = i === neckIdx
            const midX   = (lT + rT) / 2
            const clipId = `fc-${account.id}-${i}`
            return (
              <div key={stage.label}>
                {i > 0 && (
                  <div className="detail-funnel-v-connector">
                    <span className="detail-funnel-v-cost">
                      {cost != null ? fmtBRL(cost) : ''}
                    </span>
                    <div
                      className="detail-funnel-v-line"
                      style={{ background: account.color, opacity: 0.4 }}
                    />
                    <span
                      className="detail-funnel-v-rate"
                      style={{ color: rate != null ? funnelColor(rate) : '#3A4050' }}
                    >
                      {rate != null ? rate.toFixed(1) + '%' : '—'}
                    </span>
                  </div>
                )}
                <svg viewBox="0 0 520 52" style={{ display: 'block', width: '100%' }}>
                  <defs>
                    <clipPath id={clipId}>
                      <polygon points={`${lT},0 ${rT},0 ${rB},52 ${lB},52`} />
                    </clipPath>
                  </defs>
                  <polygon
                    points={`${lT},0 ${rT},0 ${rB},52 ${lB},52`}
                    fill={stage.pending ? 'none' : account.color}
                    fillOpacity={stage.pending ? 0 : FUNNEL_OPAC[i]}
                    stroke={stage.pending ? '#2A2F3A' : 'none'}
                    strokeWidth={stage.pending ? 1.5 : 0}
                    strokeDasharray={stage.pending ? '6 4' : undefined}
                  />
                  {isNeck && (
                    <polygon
                      points={`${lT},0 ${rT},0 ${rB},52 ${lB},52`}
                      fill="none"
                      stroke="#FF5A5A"
                      strokeWidth="2"
                    />
                  )}
                  <g clipPath={`url(#${clipId})`}>
                    {stage.pending ? (
                      <>
                        <text x={midX} y={18} fontSize="11" fontFamily="DM Sans, sans-serif"
                          fill="#4A5060" textAnchor="middle" dominantBaseline="middle">
                          {stage.label}
                        </text>
                        <text x={midX} y={36} fontSize="10" fontFamily="DM Sans, sans-serif"
                          fill="#3A4050" textAnchor="middle" dominantBaseline="middle">
                          dados em breve
                        </text>
                      </>
                    ) : (
                      <>
                        <text x={lT + 14} y={26} fontSize="12" fontFamily="DM Sans, sans-serif"
                          fill="rgba(255,255,255,0.9)" dominantBaseline="middle">
                          {stage.label}
                        </text>
                        <text x={rT - 14} y={26} fontSize="12" fontFamily="Space Mono, monospace"
                          fill="rgba(255,255,255,0.85)" textAnchor="end" dominantBaseline="middle">
                          {fmtN(stage.value)}
                        </text>
                      </>
                    )}
                  </g>
                </svg>
              </div>
            )
          })}
          {neckIdx !== -1 && (
            <div className="detail-funnel-neck">
              <span>⚠</span>
              <span>
                Gargalo em <strong>{stages[neckIdx].label}</strong>
                {rates[neckIdx] != null && ` — ${rates[neckIdx].toFixed(1)}% de conversão`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Seção 4 — Tabela de campanhas */}
      <div className="detail-section">
        <div className="detail-section-title">Campanhas ({campaigns.length})</div>
        <table className="detail-campaigns-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Campanha</th>
              <th>Plataforma</th>
              <th>Impressões</th>
              <th>CTR</th>
              <th>CPR</th>
              <th>Conversões</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((cr, idx) => (
              <tr key={cr.id}>
                <td className="mono" style={{ color: '#4A5060', fontSize: 11 }}>{idx + 1}</td>
                <td style={{ fontSize: 13 }}>{cr.name}</td>
                <td>
                  <span className={`tag tag-${cr.platform.toLowerCase() === 'google' ? 'google' : 'meta'}`}>
                    {cr.platform}
                  </span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>{fmtN(cr.impressions)}</td>
                <td className="mono" style={{ fontSize: 12, color: ctrColor(cr.ctr) }}>
                  {cr.ctr.toFixed(2)}%
                </td>
                <td className="mono" style={{ fontSize: 12, color: cprColor(cr.cpr) }}>
                  {fmtBRL(cr.cpr)}
                </td>
                <td className="mono" style={{ fontSize: 12 }}>{fmtN(cr.conversions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seção 5 — Split Meta vs Google */}
      <div className="detail-section">
        <div className="detail-section-title">Meta vs Google</div>

        <div className="platform-split-row" style={{ marginBottom: 16 }}>
          <div className="platform-split-name" style={{ width: 60 }}>Split</div>
          <div className="platform-split-bar-wrap">
            <div className="platform-split-meta"   style={{ width: `${split.metaPct}%`   }} />
            <div className="platform-split-google" style={{ width: `${split.googlePct}%` }} />
          </div>
          <div className="platform-split-labels">
            <span style={{ color: '#6A8ECC' }}>{split.metaPct.toFixed(0)}% Meta</span>
            <span style={{ color: '#4ECB8D' }}>{split.googlePct.toFixed(0)}% Google</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <div className="kpi-card">
            <div className="kpi-label" style={{ color: '#6A8ECC' }}>Meta Spend</div>
            <div className="kpi-val" style={{ fontSize: 15 }}>{fmtBRL(account.meta.spend)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label" style={{ color: '#4ECB8D' }}>Google Spend</div>
            <div className="kpi-val" style={{ fontSize: 15, color: account.google.spend === 0 ? '#4A5060' : '#E8EAF0' }}>
              {account.google.spend === 0 ? '—' : fmtBRL(account.google.spend)}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label" style={{ color: '#6A8ECC' }}>Meta ROAS</div>
            <div className="kpi-val" style={{ fontSize: 15, color: roasColor(split.metaROAS) }}>
              {split.metaROAS.toFixed(2)}x
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label" style={{ color: '#4ECB8D' }}>Google ROAS</div>
            <div className="kpi-val" style={{ fontSize: 15, color: account.google.spend === 0 ? '#4A5060' : roasColor(split.googleROAS) }}>
              {account.google.spend === 0 ? '—' : split.googleROAS.toFixed(2) + 'x'}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
