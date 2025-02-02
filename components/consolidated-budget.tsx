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

const timeRanges = ["D", "M", "Y", "All", "Custom"]

export function ConsolidatedBudget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-base font-medium">Consolidated budget</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border">
            {timeRanges.map((range, i) => (
              <Button
                key={range}
                variant={range === "M" ? "secondary" : "ghost"}
                size="sm"
                className={`rounded-none px-3 ${i === timeRanges.length - 1 ? "" : "border-r"}`}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <span className="sr-only">More options</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                  if (active && payload?.length) {
                    const date = payload[0].payload.date
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Revenues</span>
                            <span className="font-bold text-green-500">${payload[0].value}</span>
                            <span className="text-xs text-muted-foreground">
                              +{((payload[0].value / payload[1].value - 1) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Expenditures</span>
                            <span className="font-bold text-red-500">${payload[1].value}</span>
                            <span className="text-xs text-muted-foreground">
                              {((payload[1].value / payload[0].value) * 100).toFixed(1)}%
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
      </CardContent>
    </Card>
  )
}

