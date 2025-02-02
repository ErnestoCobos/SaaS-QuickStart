export interface BudgetData {
  date: string
  revenues: number
  expenditures: number
}

export interface BudgetProps {
  data: BudgetData[]
  timeRanges: string[]
  selectedRange?: string
  onRangeChange?: (range: string) => void
}
