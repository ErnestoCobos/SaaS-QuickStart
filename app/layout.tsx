import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkClientProvider } from '@/components/providers/clerk-provider'
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cobos Dashboard",
  description: "Modern project management dashboard",
  keywords: ["dashboard", "project management", "tasks"],
  openGraph: {
    title: "Cobos Dashboard",
    description: "Modern project management dashboard",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkClientProvider>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  )
}
