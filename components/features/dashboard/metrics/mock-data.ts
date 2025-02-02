export interface MetricData {
  label: string
  value: number
  total: number
  color: string
}

export const mockMetrics: MetricData[] = [
  { label: "Sales", value: 5.3, total: 10, color: "text-blue-500" },
  { label: "Profit", value: 2.4, total: 10, color: "text-red-500" },
  { label: "Customer", value: 7.8, total: 10, color: "text-green-500" }
]
