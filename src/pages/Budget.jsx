import { useState } from 'react'
import { calc, fmtBRL, pacingStatus } from '../utils.js'
import { useBudgets } from '../hooks/useBudgets.js'
import { Stagger, StaggerItem, AnimatedBar, FadeIn } from '../components/Motion.jsx'

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

export default function Budget({ accounts, since, until }) {
  const { budgets, saveBudget } = useBudgets(since, until)
  const [showModal, setShowModal] = useState(false)
  const [inputs,    setInputs]    = useState({})
  const [saving,    setSaving]    = useState(false)

  const allMetrics               = accounts.map(calc)
  const { totalDays, daysElapsed, expectedPct } = calcPeriod(since, until)

  const totalBudget = accounts.reduce((s, acc) => s + (budgets.get(String(acc.id)) || 0), 0)
  const totalSpend  = allMetrics.reduce((s, m) => s + m.spend, 0)
  const consumedPct = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0

  function openModal() {
    const init = {}
    accounts.forEach(acc => { init[acc.id] = budgets.get(String(acc.id)) ?? 0 })
    setInputs(init)
    setShowModal(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await Promise.all(
        accounts.map(acc => saveBudget(String(acc.id), acc.name, inputs[acc.id] ?? 0))
      )
      setShowModal(false)
    } finally {
      setSaving(false)
    }
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
          onClick={openModal}
          style={{
            background: '#1A1F28', border: '1px solid #2A2F3A', color: '#C0C8D8',
            padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
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
          <div className="kpi-trend">{accounts.length} contas · período selecionado</div>
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
          const budget = budgets.get(String(acc.id))
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
                    Defina o orçamento para ver o pacing
                  </div>
                )}
              </div>
            </StaggerItem>
          )
        })}
      </Stagger>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <FadeIn>
            <div className="modal-card">
              <div style={{ fontSize: 16, fontWeight: 500, color: '#E8EAF0', marginBottom: 4 }}>
                Editar Orçamentos
              </div>
              <div style={{ fontSize: 12, color: '#6A7284', marginBottom: 24 }}>
                Período: {fmtDate(since)} → {fmtDate(until)}
              </div>

              {accounts.map(acc => (
                <div
                  key={acc.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="dot" style={{ background: acc.color, width: 10, height: 10 }} />
                    <span style={{ fontSize: 13, color: '#C0C8D8' }}>{acc.name}</span>
                  </div>
                  <input
                    type="number"
                    className="budget-input"
                    value={inputs[acc.id] ?? 0}
                    onChange={e => setInputs(prev => ({ ...prev, [acc.id]: e.target.value }))}
                    min="0"
                    step="100"
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, borderTop: '1px solid #1E2228', paddingTop: 16 }}>
                <button className="modal-btn modal-btn-cancel" onClick={() => setShowModal(false)} disabled={saving}>
                  Cancelar
                </button>
                <button className="modal-btn modal-btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  )
}
