import { useState, useCallback, useEffect } from 'react'

export function useBudgets(since, until) {
  const [budgets, setBudgets] = useState(new Map())
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!since || !until) return
    setLoading(true)
    try {
      const res  = await fetch(`/api/budgets?since=${since}&until=${until}`)
      const data = await res.json()
      const map  = new Map()
      if (Array.isArray(data)) {
        data.forEach(b => map.set(b.account_id, parseFloat(b.budget)))
      }
      setBudgets(map)
    } catch (err) {
      console.error('[useBudgets]', err.message)
    } finally {
      setLoading(false)
    }
  }, [since, until])

  useEffect(() => { load() }, [load])

  const saveBudget = useCallback(async (accountId, accountName, value) => {
    await fetch('/api/budgets', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        account_id:   accountId,
        account_name: accountName,
        budget:       parseFloat(value) || 0,
        period_start: since,
        period_end:   until,
      }),
    })
    await load()
  }, [since, until, load])

  return { budgets, loading, saveBudget, refresh: load }
}
