import { useState, useCallback, useEffect } from 'react'
import { ACCOUNTS } from '../data.js'

function getDateRange() {
  const now = new Date()
  const y   = now.getFullYear()
  const m   = String(now.getMonth() + 1).padStart(2, '0')
  const d   = String(now.getDate()).padStart(2, '0')
  return { since: `${y}-${m}-01`, until: `${y}-${m}-${d}` }
}

export function useAccounts() {
  const isDev = import.meta.env.DEV

  const [accounts,    setAccounts]    = useState(isDev ? ACCOUNTS : [])
  const [loading,     setLoading]     = useState(!isDev)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    if (isDev) return
    setLoading(true)
    setError(null)
    const { since, until } = getDateRange()
    try {
      const res  = await fetch(`/api/accounts?since=${since}&until=${until}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAccounts(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
      // mantém dados anteriores — não limpa accounts
    } finally {
      setLoading(false)
    }
  }, [isDev])

  useEffect(() => { load() }, [load])

  return { accounts, loading, error, lastUpdated, refresh: load }
}
