import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SidebarContainer } from "@/app/sidebar-container"
import { TopNav } from "@/components/top-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="grid md:grid-cols-[auto,1fr] h-screen">
      <SidebarContainer />
      <div className="flex flex-col min-h-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}
