"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BudgetChart } from "./BudgetChart"
import { mockBudgetData, timeRanges } from "./mock-data"

export function ConsolidatedBudget() {
  const [selectedRange, setSelectedRange] = useState("M")

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-base font-medium">Consolidated budget</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border">
            {timeRanges.map((range, i) => (
              <Button
                key={range}
                variant={range === selectedRange ? "secondary" : "ghost"}
                size="sm"
                className={`rounded-none px-3 ${i === timeRanges.length - 1 ? "" : "border-r"}`}
                onClick={() => setSelectedRange(range)}
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
      <CardContent className="h-[400px]">
        <BudgetChart data={mockBudgetData} />
      </CardContent>
    </Card>
  )
}
