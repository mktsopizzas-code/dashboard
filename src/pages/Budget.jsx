import { useState, useEffect } from 'react'
import { calc, fmtBRL, pacingStatus } from '../utils.js'
import { useBudgets } from '../hooks/useBudgets.js'
import { Stagger, StaggerItem, AnimatedBar } from '../components/Motion.jsx'

const BADGE_CLASS = { 'No ritmo': 'badge-ok', 'Abaixo': 'badge-warn', 'Acima': 'badge-err' }

function fmtDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function calcPeriod(since, until) {
  const today     = new Date().toISOString().split('T')[0]
  const totalDays = Math.round((new Date(until) - new Date(since)) / 86400000) + 1
  const elapsed   = Math.round((new Date(today)  - new Date(since)) / 86400000) + 1
  const daysElapsed = Math.min(totalDays, Math.max(1, elapsed))
  return { totalDays, daysElapsed, expectedPct: (daysElapsed / totalDays) * 100 }
}

function firstOfMonth(iso) {
  const [y, m] = iso.split('-')
  return `${y}-${m}-01`
}
function lastOfMonth(iso) {
  const [y, m] = iso.split('-')
  const last = new Date(parseInt(y), parseInt(m), 0).getDate()
  return `${y}-${m}-${String(last).padStart(2, '0')}`
}

export default function Budget({ accounts, since, until }) {
  const { budgets, saveBudget } = useBudgets(since, until)
  const [editing,     setEditing]     = useState(false)
  const [formValues,  setFormValues]  = useState({})
  const [periodStart, setPeriodStart] = useState(since)
  const [periodEnd,   setPeriodEnd]   = useState(until)

  const allMetrics = accounts.map(calc)
  const { totalDays, daysElapsed, expectedPct } = calcPeriod(since, until)

  const totalBudget = accounts.reduce((s, acc) => s + (budgets.get(acc.name) || 0), 0)
  const totalSpend  = allMetrics.reduce((s, m) => s + m.spend, 0)
  const consumedPct = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0

  useEffect(() => {
    if (editing) {
      setPeriodStart(firstOfMonth(since))
      setPeriodEnd(lastOfMonth(since))
      const initial = {}
      accounts.forEach(acc => {
        const saved = budgets.get(acc.name)
        if (saved) initial[acc.name] = saved
      })
      setFormValues(initial)
    }
  }, [editing])

  async function handleSave() {
    const promises = accounts.map(acc => {
      const value = formValues[acc.name] ?? budgets.get(acc.name) ?? 0
      if (parseFloat(value) > 0) {
        return saveBudget(acc.name, acc.name, parseFloat(value), periodStart, periodEnd)
      }
      return null
    }).filter(Boolean)
    await Promise.all(promises)
    setEditing(false)
    setFormValues({})
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#8A94A6' }}>
          Orçamento:{' '}
          <span style={{ color: '#C0C8D8', fontFamily: 'Space Mono, monospace', fontSize: 12 }}>
            {fmtDate(since)} → {fmtDate(until)}
          </span>
          <span style={{ marginLeft: 12, color: '#4A5060' }}>
            {totalDays} dias · dia {daysElapsed}
          </span>
        </div>
        <button
          onClick={() => setEditing(true)}
          style={{
            background: '#FF5A1F', color: 'white', border: 'none',
            borderRadius: 6, padding: '8px 18px', fontSize: 12,
            fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Editar Orçamentos
        </button>
      </div>

      {/* KPIs */}
      <Stagger className="kpi-grid-3">
        <StaggerItem className="kpi-card">
          <div className="kpi-label">Orçamento Total</div>
          <div className="kpi-val">{fmtBRL(totalBudget)}</div>
          <div className="kpi-trend">
            {totalBudget === 0 ? 'Defina os orçamentos' : `${accounts.length} contas · período selecionado`}
          </div>
        </StaggerItem>
        <StaggerItem className="kpi-card">
          <div className="kpi-label">Gasto Acumulado</div>
          <div className="kpi-val">{fmtBRL(totalSpend)}</div>
          <div className="kpi-trend">Dia {daysElapsed} de {totalDays}</div>
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
          const budget = budgets.get(acc.name)
          const hasBudget = budget != null && budget > 0

          const status     = hasBudget ? pacingStatus(m.spend, budget, daysElapsed, totalDays) : null
          const fillPct    = hasBudget ? Math.min(status.pct, 100) : 0
          const projection = hasBudget && daysElapsed > 0 ? (m.spend / daysElapsed) * totalDays : 0
          const dailyReal  = daysElapsed > 0 ? m.spend / daysElapsed : 0
          const dailyIdeal = hasBudget && totalDays > 0 ? budget / totalDays : 0

          return (
            <StaggerItem key={acc.id}>
              <div className="proj-card">
                <div className="proj-header">
                  <div className="proj-name">
                    <span className="dot" style={{ background: acc.color, width: 10, height: 10 }} />
                    {acc.name}
                  </div>
                  {hasBudget && status && (
                    <span className={`badge ${BADGE_CLASS[status.label]}`}>{status.label}</span>
                  )}
                </div>

                {hasBudget ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6A7284', marginBottom: 4 }}>
                      <span>{fmtBRL(m.spend)}</span>
                      <span>{fmtBRL(budget)}</span>
                    </div>
                    <div className="pacing-track">
                      <AnimatedBar width={fillPct} color={status.color} delay={i * 0.05} />
                      <div className="pacing-marker" style={{ left: `${Math.min(expectedPct, 100)}%` }} />
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
                  </>
                ) : (
                  <div style={{ fontSize: 12, color: '#4A5060', marginTop: 8 }}>
                    Orçamento não definido
                    <div style={{ marginTop: 4, fontSize: 11 }}>
                      Clique em Editar Orçamentos para definir
                    </div>
                  </div>
                )}
              </div>
            </StaggerItem>
          )
        })}
      </Stagger>

      {/* Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Definir Orçamentos</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: '#4A5060', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
                Período do orçamento
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="date"
                  className="date-input"
                  value={periodStart}
                  onChange={e => setPeriodStart(e.target.value)}
                />
                <span style={{ color: '#4A5060', fontSize: 12 }}>→</span>
                <input
                  type="date"
                  className="date-input"
                  value={periodEnd}
                  onChange={e => setPeriodEnd(e.target.value)}
                />
              </div>
            </div>

            {accounts.map(acc => (
              <div className="modal-row" key={acc.id || acc.name}>
                <div className="modal-account-name">
                  <span className="dot" style={{ background: acc.color, width: 8, height: 8 }} />
                  {acc.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#4A5060', fontSize: 12 }}>R$</span>
                  <input
                    className="budget-input"
                    type="number"
                    value={formValues[acc.name] ?? budgets.get(acc.name) ?? ''}
                    onChange={e => setFormValues(prev => ({ ...prev, [acc.name]: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              <button className="modal-btn modal-btn-save" onClick={handleSave}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
