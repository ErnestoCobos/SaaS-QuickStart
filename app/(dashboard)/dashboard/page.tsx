import { Suspense } from "react"
import { FolderClosed, Cog, Settings, User } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { ConsolidatedBudget } from "@/features/dashboard/components/ConsolidatedBudget"
import { DealsTable } from "@/features/dashboard/components/deals"
import { Badge } from "@/shared/components/atoms/badge"
import { MetricCard } from "@/features/dashboard/components/metrics"
import { mockMetrics } from "@/features/dashboard/constants/metrics"

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

export default async function Dashboard() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    return (
      <Suspense fallback={<LoadingState />}>
        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">House Spectrum Ltd</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="gap-1">
                    <Settings className="h-3 w-3" />
                    Certified
                  </Badge>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Jessica Parker
                  </div>
                  <span>•</span>
                  <span>Edited 7 hrs ago</span>
                </div>
              </div>
              <div className="flex items-center gap-8 rounded-lg border bg-card p-2 text-card-foreground">
                {mockMetrics.map((metric, index) => (
                  <MetricCard
                    key={index}
                    label={metric.label}
                    value={metric.value}
                    total={metric.total}
                    color={metric.color}
                  />
                ))}
              </div>
            </div>

            <ConsolidatedBudget />
            <DealsTable />
          </div>
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Something went wrong. Please try again later.</div>
      </div>
    );
  }
}
