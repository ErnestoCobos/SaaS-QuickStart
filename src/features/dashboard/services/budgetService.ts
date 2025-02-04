import { BudgetChartData } from '@/types/dashboard'

// Mock data - would be replaced with actual API calls
const mockBudgetData: BudgetChartData[] = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 }
]

export const BudgetService = {
  async getBudgetData(): Promise<BudgetChartData[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBudgetData)
      }, 500)
    })
  },

  async getBudgetByTimeRange(range: 'D' | 'W' | 'M' | 'Y'): Promise<BudgetChartData[]> {
    // Simulate API call with time range filter
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would filter based on the time range
        resolve(mockBudgetData.slice(0, range === 'W' ? 7 : range === 'M' ? 30 : mockBudgetData.length))
      }, 500)
    })
  }
}
