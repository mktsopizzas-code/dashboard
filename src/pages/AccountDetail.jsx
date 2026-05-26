import { CREATIVES, CURRENT_DAY, DAYS_IN_MONTH } from '../data.js'
import {
  calc, fmtBRL, fmtN, ctrColor, cprColor, roasColor,
  pacingStatus, platformSplit,
  detailFunnelStages, detailFunnelRates, detailFunnelBottleneck,
} from '../utils.js'

const BADGE_CLASS = { 'No ritmo': 'badge-ok', 'Abaixo': 'badge-warn', 'Acima': 'badge-err' }

export default function AccountDetail({ account, onBack }) {
  const m       = calc(account)
  const status  = pacingStatus(m.spend, account.budget, CURRENT_DAY, DAYS_IN_MONTH)
  const split   = platformSplit(account)
  const stages  = detailFunnelStages(account)
  const rates   = detailFunnelRates(stages)
  const neckIdx = detailFunnelBottleneck(stages)

  const campaigns = [...CREATIVES]
    .filter(c => c.accountId === account.id)
    .sort((a, b) => a.cpr - b.cpr)

  const top = stages[0].value

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
          const widthPct = top > 0 ? Math.max((stage.value / top) * 100, 4) : 4
          const rate     = rates[i]
          const isNeck   = i === neckIdx
          const opacity  = 1 - i * 0.15

          return (
            <div key={stage.label}>
              {i > 0 && <div className="detail-funnel-connector" />}
              <div className="detail-funnel-row">
                <div className="detail-funnel-row-label">{stage.label}</div>
                <div
                  className={`detail-funnel-bar${stage.pending ? ' pending' : ''}${isNeck ? ' bottleneck' : ''}`}
                  style={{
                    width: `${widthPct}%`,
                    background: stage.pending
                      ? 'transparent'
                      : account.color + Math.round(opacity * 255).toString(16).padStart(2, '0'),
                  }}
                >
                  <span className="detail-funnel-bar-name">
                    {stage.pending ? 'dados em breve' : ''}
                  </span>
                  <span className="detail-funnel-bar-val">
                    {stage.pending ? '' : fmtN(stage.value)}
                  </span>
                </div>
                <div
                  className="detail-funnel-rate"
                  style={{ color: rate != null ? (isNeck ? '#FF5A5A' : '#8A94A6') : '#3A4050' }}
                >
                  {rate != null ? rate.toFixed(2) + '%' : '—'}
                </div>
              </div>
            </div>
          )
        })}
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
