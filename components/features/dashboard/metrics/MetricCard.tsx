"use client"

interface MetricCardProps {
  label: string
  value: number
  total: number
  color: string
}

export function MetricCard({ label, value, total, color }: MetricCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-semibold ${color}`}>{value}</span>
          <span className="text-sm text-muted-foreground">/{total}</span>
        </div>
      </div>
    </div>
  )
}
