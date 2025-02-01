"use client"

import {
  BarChart3,
  FolderClosed,
  Home,
  LayoutGrid,
  Users,
  Building2,
  FileText,
  HelpCircle,
  Bell,
  Rocket,
  Command,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    icon: Home,
    label: "Dashboard",
    isActive: false,
  },
  {
    icon: FolderClosed,
    label: "Projects",
    badge: "3/5",
    isActive: true,
  },
  {
    icon: BarChart3,
    label: "Analytics",
    isActive: false,
  },
  {
    icon: FileText,
    label: "Reports",
    badge: "New",
    badgeVariant: "destructive",
    isActive: false,
  },
  {
    icon: LayoutGrid,
    label: "Extensions",
    isActive: false,
  },
  {
    icon: Building2,
    label: "Companies",
    badge: "17",
    isActive: false,
  },
  {
    icon: Users,
    label: "People",
    badge: "164",
    isActive: false,
  },
]

export function Sidebar() {
  return (
    <SidebarProvider>
      <SidebarContainer className="border-r bg-[#f7f7f7] w-[240px]">
        <SidebarHeader className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-black rounded-lg p-1">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-OyDdkMw7jT9rYCzORTdu1tEyn52XmY.png"
                alt="Prody Logo"
                className="h-6 w-6"
              />
            </div>
            <span className="font-semibold">Prody</span>
          </div>

          <div className="relative">
            <Input placeholder="Search..." className="bg-muted pl-3 pr-12" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-sm bg-background px-1.5 py-0.5 text-xs text-muted-foreground border">
              <Command className="h-3 w-3" />F
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  className={`
                    w-full justify-between
                    ${item.isActive ? "bg-white shadow-sm rounded-md" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.isActive ? "text-foreground" : "text-muted-foreground"}`} />
                    <span className={item.isActive ? "font-medium" : ""}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant={(item.badgeVariant as "default" | "destructive" | "secondary") || "secondary"}
                      className="ml-auto"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="mt-auto p-4 space-y-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span>Help center</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Notifications</span>
                <Badge variant="destructive" className="ml-auto">
                  3
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Ember Crest</p>
                <p className="text-xs text-muted-foreground">3 of 5 projects created</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-square rounded bg-muted flex items-center justify-center">
                  <FolderClosed className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md px-3 py-2 text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-colors">
              <Rocket className="h-4 w-4" />
              Get full access
            </button>
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </SidebarProvider>
  )
}

