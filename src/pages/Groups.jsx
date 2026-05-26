import { calc, fmtBRL, fmtN, ctrColor, cprColor, roasColor } from '../utils.js'

function groupStats(accounts) {
  const metrics = accounts.map(calc)
  const n = accounts.length

  const totalSpend  = metrics.reduce((s, m) => s + m.spend,  0)
  const totalImp    = metrics.reduce((s, m) => s + m.imp,    0)
  const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0)
  const totalConv   = metrics.reduce((s, m) => s + m.conv,   0)
  const totalRev    = metrics.reduce((s, m) => s + m.rev,    0)

  const avgCTR  = metrics.reduce((s, m) => s + m.ctr,  0) / n
  const avgCPC  = metrics.reduce((s, m) => s + m.cpc,  0) / n
  const avgCPR  = metrics.reduce((s, m) => s + m.cpr,  0) / n
  const avgROAS = metrics.reduce((s, m) => s + m.roas, 0) / n

  return { metrics, totalSpend, totalImp, totalClicks, totalConv, totalRev, avgCTR, avgCPC, avgCPR, avgROAS }
}

function GroupBlock({ emoji, title, accounts }) {
  const { metrics, totalSpend, avgCTR, avgCPC, avgCPR, avgROAS } = groupStats(accounts)

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
          <div className="bench-avg" style={{ color: cprColor(avgCPR) }}>{fmtBRL(avgCPR)}</div>
        </div>
        <div className="bench-item">
          <div className="bench-label">ROAS Médio</div>
          <div className="bench-avg" style={{ color: roasColor(avgROAS) }}>{avgROAS.toFixed(2)}x</div>
        </div>
      </div>

      <div className="divider" />

      <div className="section-title">Contas individuais</div>
      <div className="group-accounts">
        {accounts.map((acc, i) => {
          const m = metrics[i]
          const ctrBetter  = m.ctr  >= avgCTR
          const roasBetter = m.roas >= avgROAS

          return (
            <div key={acc.id} className="group-acc-card">
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
                  <div className="group-acc-metric-val" style={{ color: cprColor(m.cpr) }}>
                    {fmtBRL(m.cpr)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Groups({ accounts }) {
  const pizzas  = accounts.filter(a => a.type === 'pizza')
  const burgers = accounts.filter(a => a.type === 'burger')

  return (
    <div>
      <GroupBlock emoji="🍕" title="Pizzarias"     accounts={pizzas}  />
      <GroupBlock emoji="🍔" title="Hamburguerias" accounts={burgers} />
    </div>
  )
}
