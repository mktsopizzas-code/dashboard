import { calc, fmtBRL, fmtN, ctrColor, roasColor, cprStatus } from '../utils.js'
import { CPR_TARGET } from '../data.js'
import { Stagger, StaggerItem, AnimatedNumber, AnimatedBar, FadeIn, HoverCard } from '../components/Motion.jsx'

export default function Overview({ accounts, onSelectAccount }) {
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
      .filter((acc, i) => {
        const cprAlert = metrics[i].cpr > avgCPR * 1.3
        const ctrAlert = metrics[i].ctr < avgCTR * 0.7
        return acc.smallMarket ? cprAlert : cprAlert || ctrAlert
      })
      .map(a => a.id)
  )

  return (
    <div>
      {/* KPI Bar */}
      <Stagger className="kpi-grid">
        <StaggerItem className="kpi-card">
          <div className="kpi-label">Gasto Total</div>
          <div className="kpi-val"><AnimatedNumber value={totalSpend} prefix="R$ " /></div>
          <div className="kpi-trend">{fmtN(totalImp)} impressões</div>
        </StaggerItem>
        <StaggerItem className="kpi-card">
          <div className="kpi-label">CTR Médio</div>
          <div className="kpi-val" style={{ color: ctrColor(consolidatedCTR) }}>
            <AnimatedNumber value={consolidatedCTR} suffix="%" />
          </div>
          <div className="kpi-trend">{fmtN(totalClicks)} cliques</div>
        </StaggerItem>
        <StaggerItem className="kpi-card">
          <div className="kpi-label">CPR Médio</div>
          <div className="kpi-val" style={{ color: cprStatus(consolidatedCPR).color }}>
            <AnimatedNumber value={consolidatedCPR} prefix="R$ " />
          </div>
          <div className="kpi-trend" style={{ color: cprStatus(consolidatedCPR).color }}>
            Meta: {fmtBRL(CPR_TARGET)}
          </div>
        </StaggerItem>
        <StaggerItem className="kpi-card">
          <div className="kpi-label">ROAS Médio</div>
          <div className="kpi-val" style={{ color: roasColor(consolidatedROAS) }}>
            <AnimatedNumber value={consolidatedROAS} suffix="x" />
          </div>
          <div className="kpi-trend">{fmtBRL(totalRev)} receita</div>
        </StaggerItem>
      </Stagger>

      {/* Alert Banner */}
      {alertIds.size > 0 && (
        <FadeIn delay={0.3}>
          <div className="alert-banner">
            <span>⚠</span>
            <span>
              Contas com performance fora da média:{' '}
              <strong>
                {accounts.filter(a => alertIds.has(a.id)).map(a => a.name).join(', ')}
              </strong>
            </span>
          </div>
        </FadeIn>
      )}

      {/* Accounts Grid */}
      <Stagger className="accounts-grid">
        {accounts.map((acc, i) => {
          const m = metrics[i]
          const isAlert = alertIds.has(acc.id)
          const totalAccSpend = acc.meta.spend + acc.google.spend
          const metaPct   = totalAccSpend > 0 ? (acc.meta.spend   / totalAccSpend) * 100 : 0
          const googlePct = totalAccSpend > 0 ? (acc.google.spend / totalAccSpend) * 100 : 0

          return (
            <StaggerItem key={acc.id}>
              <HoverCard
                className={`acc-card clickable${isAlert ? ' alert' : ''}`}
                onClick={() => onSelectAccount(acc)}
              >
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="acc-metric-val" style={{ color: cprStatus(m.cpr).color }}>
                        {fmtBRL(m.cpr)}
                      </span>
                      {m.cpr <= CPR_TARGET && <span className="badge-meta-ok">✓ Meta</span>}
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
                    <div style={{ flex: 1, height: 6, background: '#1E2228', borderRadius: 3, overflow: 'hidden' }}>
                      <AnimatedBar width={metaPct} color="#6A8ECC" />
                    </div>
                    <span className="plat-bar-val">{fmtBRL(acc.meta.spend)}</span>
                  </div>
                  <div className="plat-row">
                    <span className="plat-bar-label">Google</span>
                    <div style={{ flex: 1, height: 6, background: '#1E2228', borderRadius: 3, overflow: 'hidden' }}>
                      <AnimatedBar width={googlePct} color="#4ECB8D" />
                    </div>
                    <span className="plat-bar-val">{fmtBRL(acc.google.spend)}</span>
                  </div>
                </div>
              </HoverCard>
            </StaggerItem>
          )
        })}
      </Stagger>
    </div>
  )
}
