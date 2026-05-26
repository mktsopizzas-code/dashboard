import { calc, fmtBRL, fmtN, ctrColor, cprColor, roasColor } from '../utils.js'

export default function Overview({ accounts }) {
  const metrics = accounts.map(calc)

  const totalSpend  = metrics.reduce((s, m) => s + m.spend,  0)
  const totalImp    = metrics.reduce((s, m) => s + m.imp,    0)
  const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0)
  const totalConv   = metrics.reduce((s, m) => s + m.conv,   0)
  const totalRev    = metrics.reduce((s, m) => s + m.rev,    0)

  const consolidatedCTR  = totalImp    > 0 ? (totalClicks / totalImp) * 100 : 0
  const consolidatedCPC  = totalClicks > 0 ? totalSpend / totalClicks        : 0
  const consolidatedCPR  = totalConv   > 0 ? totalSpend / totalConv          : 0
  const consolidatedROAS = totalSpend  > 0 ? totalRev / totalSpend           : 0

  const avgCPR = metrics.reduce((s, m) => s + m.cpr, 0) / accounts.length
  const avgCTR = metrics.reduce((s, m) => s + m.ctr, 0) / accounts.length

  const alertIds = new Set(
    accounts
      .filter((_, i) => metrics[i].cpr > avgCPR * 1.3 || metrics[i].ctr < avgCTR * 0.7)
      .map(a => a.id)
  )

  return (
    <div>
      {/* KPI Bar */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Gasto Total</div>
          <div className="kpi-val">{fmtBRL(totalSpend)}</div>
          <div className="kpi-trend">{fmtN(totalImp)} impressões</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">CTR Médio</div>
          <div className="kpi-val" style={{ color: ctrColor(consolidatedCTR) }}>
            {consolidatedCTR.toFixed(2)}%
          </div>
          <div className="kpi-trend">{fmtN(totalClicks)} cliques</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">CPC Médio</div>
          <div className="kpi-val">{fmtBRL(consolidatedCPC)}</div>
          <div className="kpi-trend">por clique</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">ROAS Médio</div>
          <div className="kpi-val" style={{ color: roasColor(consolidatedROAS) }}>
            {consolidatedROAS.toFixed(2)}x
          </div>
          <div className="kpi-trend">{fmtBRL(totalRev)} receita</div>
        </div>
      </div>

      {/* Alert Banner */}
      {alertIds.size > 0 && (
        <div className="alert-banner">
          <span>⚠</span>
          <span>
            Contas com performance fora da média:{' '}
            <strong>
              {accounts.filter(a => alertIds.has(a.id)).map(a => a.name).join(', ')}
            </strong>
          </span>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="accounts-grid">
        {accounts.map((acc, i) => {
          const m = metrics[i]
          const isAlert = alertIds.has(acc.id)
          const totalAccSpend = acc.meta.spend + acc.google.spend
          const metaPct   = totalAccSpend > 0 ? (acc.meta.spend   / totalAccSpend) * 100 : 0
          const googlePct = totalAccSpend > 0 ? (acc.google.spend / totalAccSpend) * 100 : 0

          return (
            <div key={acc.id} className={`acc-card${isAlert ? ' alert' : ''}`}>
              <div className="acc-header">
                <div className="acc-header-left">
                  <span className="dot" style={{ background: acc.color, width: 10, height: 10 }} />
                  <div>
                    <div className="acc-name">{acc.name}</div>
                    <div className="acc-type">{acc.type === 'pizza' ? 'Pizzaria' : 'Hamburgueria'}</div>
                  </div>
                </div>
                {isAlert && <span className="badge badge-err">Alerta</span>}
              </div>

              <div className="acc-metrics">
                <div className="acc-metric">
                  <div className="acc-metric-label">CTR</div>
                  <div className="acc-metric-val" style={{ color: ctrColor(m.ctr) }}>
                    {m.ctr.toFixed(2)}%
                  </div>
                </div>
                <div className="acc-metric">
                  <div className="acc-metric-label">CPC</div>
                  <div className="acc-metric-val">{fmtBRL(m.cpc)}</div>
                </div>
                <div className="acc-metric">
                  <div className="acc-metric-label">CPR</div>
                  <div className="acc-metric-val" style={{ color: cprColor(m.cpr) }}>
                    {fmtBRL(m.cpr)}
                  </div>
                </div>
                <div className="acc-metric">
                  <div className="acc-metric-label">ROAS</div>
                  <div className="acc-metric-val" style={{ color: roasColor(m.roas) }}>
                    {m.roas.toFixed(2)}x
                  </div>
                </div>
              </div>

              <div className="acc-platform-split">
                <div className="plat-row">
                  <span className="plat-bar-label">Meta</span>
                  <div className="plat-bar meta" style={{ width: `${metaPct}%`, maxWidth: '100%' }} />
                  <span className="plat-bar-val">{fmtBRL(acc.meta.spend)}</span>
                </div>
                <div className="plat-row">
                  <span className="plat-bar-label">Google</span>
                  <div className="plat-bar google" style={{ width: `${googlePct}%`, maxWidth: '100%' }} />
                  <span className="plat-bar-val">{fmtBRL(acc.google.spend)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
