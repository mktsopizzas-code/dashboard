import { useState } from 'react'

const CREDS = { user: 'admin', pass: 'trafficops2025' }

export default function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err,  setErr]  = useState('')

  function attempt() {
    if (user === CREDS.user && pass === CREDS.pass) {
      sessionStorage.setItem('to_auth', '1')
      onLogin()
    } else {
      setErr('Usuário ou senha incorretos.')
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') attempt()
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">T</div>
        <div className="login-title">TrafficOps</div>
        <div className="login-sub">Gestão de Tráfego Delivery</div>

        <label className="login-label">Usuário</label>
        <input
          className="login-input"
          type="text"
          value={user}
          onChange={e => setUser(e.target.value)}
          onKeyDown={handleKey}
          placeholder="admin"
          autoComplete="username"
        />

        <label className="login-label">Senha</label>
        <input
          className="login-input"
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={handleKey}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <button className="login-btn" onClick={attempt}>Entrar</button>
        {err && <div className="login-err">{err}</div>}
      </div>
    </div>
  )
}
