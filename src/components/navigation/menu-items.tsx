'use server'

import { MenuItem } from "@/lib/generate-menu"

export async function getMenuItems(): Promise<MenuItem[]> {
  // Static menu items for now
  return [
    {
      iconName: "Home",
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      iconName: "FolderClosed",
      label: "Projects",
      href: "/projects",
    },
    {
      iconName: "BarChart3",
      label: "Analytics",
      href: "/analytics",
    },
    {
      iconName: "FileText",
      label: "Reports",
      href: "/reports",
    },
    {
      iconName: "Bell",
      label: "Test Notifications",
      href: "/test-notifications",
      badge: "New",
      badgeVariant: "default",
    }
  ]
}
