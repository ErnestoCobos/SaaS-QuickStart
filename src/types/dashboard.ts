export interface Budget {
  amount: number
  category: string
  date: string
}

export type TimeRange = 'D' | 'W' | 'M' | 'Y'

export interface MetricCard {
  title: string
  value: number
  trend: 'up' | 'down'
  percentage: number
}

export interface BudgetChartData {
  name: string
  income: number
  expenses: number
}
