"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "2 May, 23", revenues: 8000, expenditures: 4000 },
  { date: "Jun 23", revenues: 12000, expenditures: 6000 },
  { date: "Jul 23", revenues: 10000, expenditures: 7000 },
  { date: "Aug 23", revenues: 15000, expenditures: 8000 },
  { date: "Sep 23", revenues: 13000, expenditures: 6500 },
  { date: "Jan 17, 24", revenues: 13546, expenditures: 4254 },
]

const timeRanges = [
  { label: "D", value: "day" },
  { label: "M", value: "month" },
  { label: "Y", value: "year" },
  { label: "All", value: "all" },
]

export function ConsolidatedBudget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Consolidated budget</CardTitle>
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <Button key={range.value} variant={range.value === "month" ? "default" : "outline"} size="sm">
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
                  if (active && payload?.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Revenues</span>
                            <span className="font-bold text-green-500">
                              +{((payload[0].value / payload[1].value - 1) * 100).toFixed(1)}%
                            </span>
                            <span className="text-xs text-muted-foreground">${payload[0].value}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Expenditures</span>
                            <span className="font-bold text-red-500">
                              +{((payload[1].value / payload[0].value) * 100).toFixed(1)}%
                            </span>
                            <span className="text-xs text-muted-foreground">${payload[1].value}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="revenues" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenditures" stroke="#dc2626" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

