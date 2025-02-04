import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SidebarContainer } from "@/components/navigation"
import { TopNav } from "@/shared/components/organisms/navigation"

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
