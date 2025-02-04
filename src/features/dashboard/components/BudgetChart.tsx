import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BudgetChartData } from '@/types/dashboard'
import { CHART_CONFIG } from '../constants/dashboard'
import { formatCurrency } from '@/utils/formatting/currency'

interface BudgetChartProps {
  data: BudgetChartData[]
}

export function BudgetChart({ data }: BudgetChartProps) {
  return (
    <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
      <AreaChart
        data={data}
        margin={CHART_CONFIG.margin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value).replace('$', '')}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(label) => `Period: ${label}`}
        />
        <Area
          type="monotone"
          dataKey="income"
          stackId="1"
          stroke="#4ade80"
          fill="#4ade80"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId="1"
          stroke="#f43f5e"
          fill="#f43f5e"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
