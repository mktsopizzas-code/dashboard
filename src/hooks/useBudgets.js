import { useState, useCallback, useEffect } from 'react'

export function useBudgets(since, until) {
  const [budgets,      setBudgets]      = useState(new Map())
  const [budgetPeriod, setBudgetPeriod] = useState(null)
  const [loading,      setLoading]      = useState(false)

  const load = useCallback(async () => {
    if (!since || !until) return
    setLoading(true)
    try {
      const res  = await fetch(`/api/budgets?since=${since}&until=${until}`)
      const data = await res.json()
      const map  = new Map()
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(b => map.set(b.account_id, parseFloat(b.budget)))
        setBudgetPeriod({ start: data[0].period_start, end: data[0].period_end })
      } else {
        setBudgetPeriod(null)
      }
      setBudgets(map)
    } catch (err) {
      console.error('[useBudgets]', err.message)
    } finally {
      setLoading(false)
    }
  }, [since, until])

  useEffect(() => { load() }, [load])

  const saveBudget = useCallback(async (accountId, accountName, value, periodStart, periodEnd) => {
    await fetch('/api/budgets', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        account_id:   accountId,
        account_name: accountName,
        budget:       parseFloat(value) || 0,
        period_start: periodStart || since,
        period_end:   periodEnd   || until,
      }),
    })
    await load()
  }, [since, until, load])

  return { budgets, budgetPeriod, loading, saveBudget, refresh: load }
}
