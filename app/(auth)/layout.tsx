import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "Authentication - Cobos Dashboard",
  description: "Sign in to access your dashboard",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center overflow-hidden">
      {children}
    </div>
  )
}
