import { CREATIVES, CURRENT_DAY, DAYS_IN_MONTH } from '../data.js'
import {
  calc, fmtBRL, fmtN, ctrColor, cprColor, roasColor,
  pacingStatus, platformSplit, detailFunnelRateColor,
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

  const FUNNEL_LT     = [0,   79,  154, 202]
  const FUNNEL_LB     = [79,  154, 202, 202]
  const FUNNEL_RT     = [560, 481, 406, 358]
  const FUNNEL_RB     = [481, 406, 358, 358]
  const FUNNEL_TOP_OP = [1.00, 0.88, 0.76, 0.64]
  const FUNNEL_BOT_OP = [0.88, 0.76, 0.64, 0.52]

  const validRates = rates.filter(r => r !== null)
  const showNeck   = neckIdx !== -1 && validRates.length >= 2

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

        {stages.map((stage, i) => {
          const lT    = FUNNEL_LT[i], rT = FUNNEL_RT[i]
          const lB    = FUNNEL_LB[i], rB = FUNNEL_RB[i]
          const rate  = rates[i]
          const cost  = costs[i]
          const midX  = 280
          const textLX = Math.round((lT + lB) / 2) + 16
          const textRX = Math.round((rT + rB) / 2) - 16
          const gId   = `fg-${account.id}-${i}`
          const cId   = `fc-${account.id}-${i}`
          return (
            <div key={stage.label} className="detail-funnel-v-row">
              <div className="detail-funnel-v-left">
                {!stage.pending && cost != null ? fmtBRL(cost) : ''}
              </div>
              <div className="detail-funnel-v-center">
                <svg viewBox="0 0 560 64" width="560" height="64" style={{ display: 'block' }}>
                  <defs>
                    {!stage.pending && (
                      <linearGradient id={gId} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
                        <stop offset="0%"   stopColor={account.color} stopOpacity={FUNNEL_TOP_OP[i]} />
                        <stop offset="100%" stopColor={account.color} stopOpacity={FUNNEL_BOT_OP[i]} />
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
          )
        })}

        {showNeck && (
          <div className="detail-funnel-neck">
            <span>⚠</span>
            <span>
              Gargalo em <strong>{stages[neckIdx].label}</strong>
              {rates[neckIdx] != null && `: ${rates[neckIdx].toFixed(1)}% de conversão`}
            </span>
          </div>
        )}
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
