import { useState } from 'react'
import { STYLES } from './styles.js'
import { ACCOUNTS, CURRENT_DAY, DAYS_IN_MONTH } from './data.js'
import Login from './Login.jsx'
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

export default function App() {
  const [auth, setAuth] = useState(sessionStorage.getItem('to_auth') === '1')
  const [page, setPage] = useState('overview')

  if (!auth) return (
    <>
      <style>{STYLES}</style>
      <Login onLogin={() => setAuth(true)} />
    </>
  )

  const current = NAV.find(n => n.key === page)

  const pageComponent = {
    overview:  <Overview  accounts={ACCOUNTS} />,
    groups:    <Groups    accounts={ACCOUNTS} />,
    creatives: <Creatives accounts={ACCOUNTS} />,
    budget:    <Budget    accounts={ACCOUNTS} />,
    extras:    <Extras    accounts={ACCOUNTS} />,
    funnel:    <Funnel    accounts={ACCOUNTS} />,
  }[page]

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
                onClick={() => setPage(n.key)}
              >
                <span className="nav-item-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </nav>

          <div className="nav-dot-list">
            <div className="sb-section">Contas</div>
            {ACCOUNTS.map(acc => (
              <div key={acc.id} className="nav-dot">
                <span className="dot" style={{ background: acc.color }} />
                {acc.name}
              </div>
            ))}
          </div>

          <div className="sb-footer">
            <div>Maio 2026 · Dia {CURRENT_DAY}/{DAYS_IN_MONTH}</div>
            <div>Meta + Google Ads</div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <h1>{current.title}</h1>
              <p>{current.sub}</p>
            </div>
            <div className="topbar-right">
              <span className="badge badge-ok">{ACCOUNTS.length} contas ativas</span>
              <span className="badge badge-warn">Dia {CURRENT_DAY}/{DAYS_IN_MONTH}</span>
            </div>
          </header>
          <div className="content">
            {pageComponent}
          </div>
        </div>

      </div>
    </>
  )
}
