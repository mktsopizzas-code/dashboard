import { useState } from 'react'
import { STYLES } from './styles.js'
import { CURRENT_DAY, DAYS_IN_MONTH } from './data.js'
import { useAccounts } from './hooks/useAccounts.js'
import { PageTransition } from './components/Motion.jsx'
import Login from './Login.jsx'
import AccountDetail from './pages/AccountDetail.jsx'
import Overview from './pages/Overview.jsx'
import Groups from './pages/Groups.jsx'
import Creatives from './pages/Creatives.jsx'
import Budget from './pages/Budget.jsx'
import Extras from './pages/Extras.jsx'
import Funnel from './pages/Funnel.jsx'

const NAV = [
  { key: 'overview',  icon: '◈', label: 'Visão Geral',   title: 'Visão Geral',    sub: 'Resumo consolidado das 6 contas' },
  { key: 'groups',    icon: '◉', label: 'Categorias',    title: 'Categorias',     sub: 'Benchmark por segmento' },
  { key: 'creatives', icon: '◫', label: 'Criativos',     title: 'Criativos',      sub: 'Performance por criativo' },
  { key: 'budget',    icon: '◷', label: 'Verba/Pacing',  title: 'Verba & Pacing', sub: 'Controle de orçamento mensal' },
  { key: 'extras',    icon: '◬', label: 'Extras',        title: 'Extras',         sub: 'Horários, plataformas e UTMs' },
  { key: 'funnel',    icon: '◆', label: 'Funil',         title: 'Funil',          sub: 'Análise do funil de conversão' },
]

function isoToday() {
  return new Date().toISOString().split('T')[0]
}
function isoFirstOfMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export default function App() {
  const [auth, setAuth]                       = useState(sessionStorage.getItem('to_auth') === '1')
  const [page, setPage]                       = useState('overview')
  const [selectedAccount, setSelectedAccount] = useState(null)

  const [since, setSince] = useState(isoFirstOfMonth)
  const [until, setUntil] = useState(isoToday)
  const [draftSince, setDraftSince] = useState(isoFirstOfMonth)
  const [draftUntil, setDraftUntil] = useState(isoToday)

  const { accounts, loading, error, lastUpdated, refresh } = useAccounts(since, until)

  const applyDates = () => {
    setSince(draftSince)
    setUntil(draftUntil)
  }

  const setShortcut = (s, u) => {
    setDraftSince(s)
    setDraftUntil(u)
    setSince(s)
    setUntil(u)
  }

  if (!auth) return (
    <>
      <style>{STYLES}</style>
      <Login onLogin={() => setAuth(true)} />
    </>
  )

  const current = NAV.find(n => n.key === page)

  const pageComponent = {
    overview:  <Overview  accounts={accounts} onSelectAccount={setSelectedAccount} />,
    groups:    <Groups    accounts={accounts} />,
    creatives: <Creatives accounts={accounts} />,
    budget:    <Budget    accounts={accounts} />,
    extras:    <Extras    accounts={accounts} />,
    funnel:    <Funnel    accounts={accounts} />,
  }[page]

  let mainContent
  if (loading && accounts.length === 0) {
    mainContent = (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A94A6' }}>
        Carregando dados...
      </div>
    )
  } else if (selectedAccount) {
    mainContent = <AccountDetail account={selectedAccount} onBack={() => setSelectedAccount(null)} />
  } else {
    mainContent = (
      <div className="content">
        {error && (
          <div className="alert-banner">
            <span>Erro ao carregar dados. </span>
            <button
              onClick={refresh}
              style={{ background: 'none', border: 'none', color: '#FF8C42', cursor: 'pointer', fontSize: 12, textDecoration: 'underline', padding: 0, fontFamily: 'inherit' }}
            >
              Tentar novamente
            </button>
          </div>
        )}
        {pageComponent}
      </div>
    )
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">

        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-icon">T</div>
            <div className="sb-logo-text">TrafficOps</div>
            <div className="sb-logo-sub">Gestão de Tráfego Delivery</div>
          </div>

          <nav className="sb-nav">
            <div className="sb-section">Navegação</div>
            {NAV.map(n => (
              <div
                key={n.key}
                className={`nav-item${page === n.key ? ' active' : ''}`}
                onClick={() => { setPage(n.key); setSelectedAccount(null) }}
              >
                <span className="nav-item-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </nav>

          <div className="nav-dot-list">
            <div className="sb-section">Contas</div>
            {accounts.map(acc => (
              <div key={acc.id} className="nav-dot">
                <span className="dot" style={{ background: acc.color }} />
                {acc.name}
              </div>
            ))}
          </div>

          <div className="sb-footer">
            <div>Maio 2026 · Dia {CURRENT_DAY}/{DAYS_IN_MONTH}</div>
            <div>Meta + Google Ads</div>
            {lastUpdated && (
              <div style={{ marginTop: 4, color: '#4A5060', fontSize: 10 }}>
                Atualizado: {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <h1>{current.title}</h1>
              <p>{current.sub}</p>
            </div>
            <div className="topbar-right">
              <div className="date-filter">
                <span className="date-shortcut" onClick={() => setShortcut(isoToday(), isoToday())}>Hoje</span>
                <span className="date-shortcut" onClick={() => {
                  const t = new Date()
                  const u = t.toISOString().split('T')[0]
                  t.setDate(t.getDate() - 7)
                  setShortcut(t.toISOString().split('T')[0], u)
                }}>7 dias</span>
                <span className="date-shortcut" onClick={() => setShortcut(isoFirstOfMonth(), isoToday())}>Este mês</span>
                <span className="date-shortcut" onClick={() => {
                  const t = new Date()
                  t.setDate(1)
                  t.setMonth(t.getMonth() - 1)
                  const s = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-01`
                  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0)
                  setShortcut(s, last.toISOString().split('T')[0])
                }}>Mês passado</span>

                <span style={{ color: '#4A5060', fontSize: 11 }}>De:</span>
                <input
                  type="date"
                  className="date-input"
                  value={draftSince}
                  onChange={e => setDraftSince(e.target.value)}
                />
                <span style={{ color: '#4A5060', fontSize: 11 }}>Até:</span>
                <input
                  type="date"
                  className="date-input"
                  value={draftUntil}
                  onChange={e => setDraftUntil(e.target.value)}
                />
                <button className="date-shortcut" style={{ color: '#E8EAF0', borderColor: '#4A5060' }} onClick={applyDates}>
                  Aplicar
                </button>
              </div>

              <button
                onClick={refresh}
                style={{ background: 'none', border: '1px solid #2A2F3A', color: '#6A7284', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: 13 }}
              >
                ↻
              </button>
              <span className="badge badge-ok">
                {loading ? '…' : `${accounts.length} contas ativas`}
              </span>
              <span className="badge badge-warn">Dia {CURRENT_DAY}/{DAYS_IN_MONTH}</span>
            </div>
          </header>
          <PageTransition pageKey={selectedAccount ? `account-${selectedAccount.id}` : page}>
            {mainContent}
          </PageTransition>
        </div>

      </div>
    </>
  )
}
