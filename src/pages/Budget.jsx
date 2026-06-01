import { DAYS_IN_MONTH, CURRENT_DAY } from '../data.js'
import { calc, fmtBRL, pacingStatus } from '../utils.js'
import { Stagger, StaggerItem, AnimatedBar } from '../components/Motion.jsx'

const BADGE_CLASS = { 'No ritmo': 'badge-ok', 'Abaixo': 'badge-warn', 'Acima': 'badge-err' }

export default function Budget({ accounts }) {
  const allMetrics = accounts.map(calc)

  const totalBudget = accounts.reduce((s, a) => s + a.budget, 0)
  const totalSpend  = allMetrics.reduce((s, m) => s + m.spend, 0)
  const consumedPct = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0

  const expectedPct = (CURRENT_DAY / DAYS_IN_MONTH) * 100

  return (
    <div>
      {/* KPIs */}
      <Stagger className="kpi-grid-3">
        <StaggerItem className="kpi-card">
          <div className="kpi-label">Orçamento Total</div>
          <div className="kpi-val">{fmtBRL(totalBudget)}</div>
          <div className="kpi-trend">6 contas · mês corrente</div>
        </StaggerItem>
        <StaggerItem className="kpi-card">
          <div className="kpi-label">Gasto Acumulado</div>
          <div className="kpi-val">{fmtBRL(totalSpend)}</div>
          <div className="kpi-trend">Dia {CURRENT_DAY} de {DAYS_IN_MONTH}</div>
        </StaggerItem>
        <StaggerItem className="kpi-card">
          <div className="kpi-label">% Consumido</div>
          <div className="kpi-val">{consumedPct.toFixed(1)}%</div>
          <div className="kpi-trend">Esperado: {expectedPct.toFixed(1)}%</div>
        </StaggerItem>
      </Stagger>

      {/* Pacing cards */}
      <Stagger className="budget-grid">
        {accounts.map((acc, i) => {
          const m      = allMetrics[i]
          const status = pacingStatus(m.spend, acc.budget, CURRENT_DAY, DAYS_IN_MONTH)
          const projection    = (m.spend / CURRENT_DAY) * DAYS_IN_MONTH
          const dailyReal     = m.spend / CURRENT_DAY
          const dailyIdeal    = acc.budget / DAYS_IN_MONTH
          const fillPct       = Math.min(status.pct, 100)
          const markerLeft    = Math.min(expectedPct, 100)

          return (
            <StaggerItem key={acc.id}>
              <div className="proj-card">
                <div className="proj-header">
                  <div className="proj-name">
                    <span className="dot" style={{ background: acc.color, width: 10, height: 10 }} />
                    {acc.name}
                  </div>
                  <span className={`badge ${BADGE_CLASS[status.label]}`}>{status.label}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6A7284', marginBottom: 4 }}>
                  <span>{fmtBRL(m.spend)}</span>
                  <span>{fmtBRL(acc.budget)}</span>
                </div>

                <div className="pacing-track">
                  <AnimatedBar width={fillPct} color={status.color} delay={i * 0.05} />
                  <div
                    className="pacing-marker"
                    style={{ left: `${markerLeft}%` }}
                  />
                </div>

                <div className="pacing-labels">
                  <span>{status.pct.toFixed(1)}% consumido</span>
                  <span>Projeção: {fmtBRL(projection)}</span>
                </div>

                <div className="proj-mini-grid">
                  <div className="proj-mini">
                    <div className="proj-mini-label">Gasto diário</div>
                    <div className="proj-mini-val">{fmtBRL(dailyReal)}</div>
                  </div>
                  <div className="proj-mini">
                    <div className="proj-mini-label">Diário ideal</div>
                    <div className="proj-mini-val">{fmtBRL(dailyIdeal)}</div>
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
