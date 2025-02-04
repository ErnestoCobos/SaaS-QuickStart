import { useState, useEffect } from 'react'
import { BudgetChartData, TimeRange } from '@/types/dashboard'
import { BudgetService } from '../services/budgetService'

export const useBudgetData = (timeRange: TimeRange) => {
  const [data, setData] = useState<BudgetChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await BudgetService.getBudgetByTimeRange(timeRange)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch budget data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  return {
    data,
    loading,
    error
  }
}
