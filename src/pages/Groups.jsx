import { calc, fmtBRL, fmtN, ctrColor, roasColor, cprStatus } from '../utils.js'
import { CPR_TARGET } from '../data.js'
import { Stagger, StaggerItem } from '../components/Motion.jsx'

function groupStats(accounts) {
  const metrics = accounts.map(calc)
  const n = accounts.length

  const totalSpend  = metrics.reduce((s, m) => s + m.spend,  0)
  const totalImp    = metrics.reduce((s, m) => s + m.imp,    0)
  const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0)
  const totalConv   = metrics.reduce((s, m) => s + m.conv,   0)
  const totalRev    = metrics.reduce((s, m) => s + m.rev,    0)

  const avgCTR  = n > 0 ? metrics.reduce((s, m) => s + m.ctr,  0) / n : 0
  const avgCPC  = n > 0 ? metrics.reduce((s, m) => s + m.cpc,  0) / n : 0
  const avgCPR  = n > 0 ? metrics.reduce((s, m) => s + m.cpr,  0) / n : 0
  const avgROAS = n > 0 ? metrics.reduce((s, m) => s + m.roas, 0) / n : 0

  return { metrics, totalSpend, totalImp, totalClicks, totalConv, totalRev, avgCTR, avgCPC, avgCPR, avgROAS }
}

function GroupBlock({ emoji, title, accounts }) {
  if (!accounts.length) return null

  const { metrics, totalSpend, avgCTR, avgCPC, avgCPR, avgROAS } = groupStats(accounts)
  const inTargetCount = metrics.filter(m => m.cpr <= CPR_TARGET).length

  return (
    <div className="group-block">
      <div className="group-header">
        <div>
          <div className="group-title">{emoji} {title}</div>
          <div className="group-spend" style={{ marginTop: 4 }}>{accounts.length} contas · {fmtBRL(totalSpend)} gastos</div>
        </div>
      </div>

      <div className="section-title">Benchmark do grupo</div>
      <div className="bench-grid">
        <div className="bench-item">
          <div className="bench-label">CTR Médio</div>
          <div className="bench-avg" style={{ color: ctrColor(avgCTR) }}>{avgCTR.toFixed(2)}%</div>
        </div>
        <div className="bench-item">
          <div className="bench-label">CPC Médio</div>
          <div className="bench-avg">{fmtBRL(avgCPC)}</div>
        </div>
        <div className="bench-item">
          <div className="bench-label">CPR Médio</div>
          <div className="bench-avg" style={{ color: cprStatus(avgCPR).color }}>{fmtBRL(avgCPR)}</div>
          <div style={{ fontSize: 11, marginTop: 4, color: inTargetCount > 0 ? '#4ECB8D' : '#FF5A5A' }}>
            {inTargetCount > 0
              ? `${inTargetCount} conta${inTargetCount > 1 ? 's' : ''} dentro da meta`
              : 'Nenhuma conta dentro da meta'}
          </div>
        </div>
        <div className="bench-item">
          <div className="bench-label">ROAS Médio</div>
          <div className="bench-avg" style={{ color: roasColor(avgROAS) }}>{avgROAS.toFixed(2)}x</div>
        </div>
      </div>

      <div className="divider" />

      <div className="section-title">Contas individuais</div>
      <Stagger className="group-accounts">
        {accounts.map((acc, i) => {
          const m = metrics[i]
          const ctrBetter  = m.ctr  >= avgCTR
          const roasBetter = m.roas >= avgROAS

          return (
            <StaggerItem key={acc.id} className="group-acc-card">
              <div className="group-acc-name">
                <span className="dot" style={{ background: acc.color, width: 10, height: 10 }} />
                {acc.name}
              </div>
              <div className="group-acc-metrics">
                <div className="group-acc-metric">
                  <div className="group-acc-metric-label">CTR</div>
                  <div
                    className="group-acc-metric-val"
                    style={{ color: ctrBetter ? '#4ECB8D' : '#FF5A5A' }}
                  >
                    {m.ctr.toFixed(2)}%
                  </div>
                </div>
                <div className="group-acc-metric">
                  <div className="group-acc-metric-label">ROAS</div>
                  <div
                    className="group-acc-metric-val"
                    style={{ color: roasBetter ? '#4ECB8D' : '#FF5A5A' }}
                  >
                    {m.roas.toFixed(2)}x
                  </div>
                </div>
                <div className="group-acc-metric">
                  <div className="group-acc-metric-label">CPR</div>
                  <div className="group-acc-metric-val" style={{ color: cprStatus(m.cpr).color }}>
                    {fmtBRL(m.cpr)}
                  </div>
                </div>
              </div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </div>
  )
}

export default function Groups({ accounts }) {
  const pizzas  = accounts.filter(a => a.type === 'pizza')
  const burgers = accounts.filter(a => a.type === 'burger')

  return (
    <Stagger>
      <StaggerItem>
        <GroupBlock emoji="🍕" title="Pizzarias"     accounts={pizzas}  />
      </StaggerItem>
      <StaggerItem>
        <GroupBlock emoji="🍔" title="Hamburguerias" accounts={burgers} />
      </StaggerItem>
    </Stagger>
  )
}
