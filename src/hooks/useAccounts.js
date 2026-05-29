import { useState, useCallback, useEffect } from 'react'
import { ACCOUNTS } from '../data.js'

export function useAccounts(since, until) {
  const isDev = import.meta.env.DEV

  const [accounts,    setAccounts]    = useState(isDev ? ACCOUNTS : [])
  const [loading,     setLoading]     = useState(!isDev)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    if (isDev) return
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`/api/accounts?since=${since}&until=${until}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAccounts(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isDev, since, until])

  useEffect(() => { load() }, [load])

  return { accounts, loading, error, lastUpdated, refresh: load }
}
