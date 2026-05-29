import { useState } from 'react'
import { STYLES } from './styles.js'
import { CURRENT_DAY, DAYS_IN_MONTH } from './data.js'
import { useAccounts } from './hooks/useAccounts.js'
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

export default function App() {
  const [auth, setAuth]                       = useState(sessionStorage.getItem('to_auth') === '1')
  const [page, setPage]                       = useState('overview')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const { accounts, loading, error, lastUpdated, refresh } = useAccounts()

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
                onClick={() => setPage(n.key)}
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
          {mainContent}
        </div>

      </div>
    </>
  )
}
