"use client"

import {
  Home,
  FolderClosed,
  BarChart3,
  FileText,
  LayoutGrid,
  Building2,
  Users,
  HelpCircle,
  Bell,
  LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Home,
  FolderClosed,
  BarChart3,
  FileText,
  LayoutGrid,
  Building2,
  Users,
  HelpCircle,
  Bell,
}

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || FolderClosed
}
