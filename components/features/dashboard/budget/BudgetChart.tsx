"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { BudgetData } from "./types"

interface BudgetChartProps {
  data: BudgetData[]
}

export function BudgetChart({ data }: BudgetChartProps) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length >= 2) {
                const date = payload[0].payload.date
                const revenue = Number(payload[0].value) || 0
                const expenditure = Number(payload[1].value) || 0
                
                const revenuePercentage = expenditure > 0 
                  ? ((revenue / expenditure - 1) * 100).toFixed(1)
                  : "0"
                
                const expenditurePercentage = revenue > 0
                  ? ((expenditure / revenue) * 100).toFixed(1)
                  : "0"

                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Revenues</span>
                        <span className="font-bold text-green-500">${revenue}</span>
                        <span className="text-xs text-muted-foreground">
                          +{revenuePercentage}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Expenditures</span>
                        <span className="font-bold text-red-500">${expenditure}</span>
                        <span className="text-xs text-muted-foreground">
                          {expenditurePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 border-t pt-2">
                      <span className="text-xs font-medium">{date}</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            strokeWidth={2}
            dataKey="revenues"
            stroke="#2563eb"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            strokeWidth={2}
            dataKey="expenditures"
            stroke="#dc2626"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
