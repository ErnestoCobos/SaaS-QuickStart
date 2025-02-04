"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Command, Rocket, FolderClosed } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import { getIcon } from "@/lib/icon-map"
import { Badge } from "@/shared/components/atoms/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/atoms/avatar"
import { Input } from "@/shared/components/atoms/input"
import {
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  MenuItem,
  useSidebar,
} from "@/shared/components/atoms/sidebar"
import { MenuItem as MenuItemType } from "@/lib/generate-menu"

interface SidebarProps {
  menuItems: MenuItemType[]
}

export function Sidebar({ menuItems }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebar()
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <SidebarContainer className="bg-gradient-to-b from-gray-50 to-white border-r">
      <SidebarHeader>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black rounded-lg p-1.5">
            <img
              src="/logo.png"
              alt="Prody Logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </div>
          {!collapsed && <span className="font-semibold text-xl">Prody</span>}
        </div>

        {!collapsed && (
          <div className="relative mt-2">
            <Input 
              placeholder="Search..." 
              className="bg-gray-100/80 border-transparent h-10 text-sm pl-10 transition-all hover:bg-gray-100 focus:bg-white focus:border-transparent focus:ring-0 rounded-full" 
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Command className="h-4 w-4 text-gray-400" />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 text-xs text-gray-400/80">
              <Command className="h-3 w-3" />F
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <div className="mb-3 px-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Main Menu</p>
        </div>
        
        <SidebarMenu className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const iconClass = `h-5 w-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`;
            const menuItemClass = `transition-all duration-200 hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : ''}`;
            
            return (
              <Link 
                href={item.href} 
                key={item.label} 
                style={{ textDecoration: 'none' }}
              >
                <MenuItem
                  active={isActive}
                  className={menuItemClass}
                  icon={React.createElement(getIcon(item.iconName), { className: iconClass })}
                  badge={
                    item.badge ? (
                      <Badge
                        variant={item.badgeVariant as "default" | "destructive"}
                        className={
                          item.badgeVariant === "destructive"
                            ? "bg-red-500 hover:bg-red-500 text-white font-normal px-2 rounded-md"
                            : "bg-transparent text-muted-foreground font-normal px-0"
                        }
                      >
                        {item.badge}
                      </Badge>
                    ) : null
                  }
                >
                  {item.label}
                </MenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="space-y-6">
        <div>
          <div className="mb-3 px-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Support</p>
          </div>
          
          <SidebarMenu className="px-3 space-y-1">
            <Link href="/help" style={{ textDecoration: 'none' }}>
              <MenuItem icon={React.createElement(getIcon("HelpCircle"), { className: "h-5 w-5" })}>Help center</MenuItem>
            </Link>
            <Link href="/notifications" style={{ textDecoration: 'none' }}>
              <MenuItem
                icon={React.createElement(getIcon("Bell"), { className: "h-5 w-5" })}
                badge={
                  <Badge
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-500 text-white font-normal px-2 rounded-md"
                  >
                    3
                  </Badge>
                }
              >
                Notifications
              </MenuItem>
            </Link>
          </SidebarMenu>
        </div>

        {!collapsed && (
          <div className="px-3">
            <button 
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100/80 transition-colors text-left"
              onClick={() => document.querySelector<HTMLElement>(".cl-userButtonTrigger")?.click()}
            >
              <UserButton afterSignOutUrl="/sign-in" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName || "Account"}</p>
                <p className="text-xs text-gray-500 truncate">Manage your account</p>
              </div>
            </button>
          </div>
        )}
      </SidebarFooter>
    </SidebarContainer>
  )
}
