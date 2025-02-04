"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH = "300px"
const SIDEBAR_WIDTH_COLLAPSED = "64px"

const sidebarVariants = cva(
  "relative inset-y-0 z-10 hidden md:flex flex-col transition-all duration-300 ease-in-out h-screen overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-r",
        floating: "m-2 rounded-lg border shadow-lg backdrop-blur-sm",
      },
      side: {
        left: "left-0",
        right: "right-0",
      },
      collapsed: {
        true: "w-[var(--sidebar-width-collapsed)]",
        false: "w-[var(--sidebar-width)]",
      },
    },
    defaultVariants: {
      variant: "default",
      side: "left",
      collapsed: false,
    },
  },
)

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  asChild?: boolean
}

const SidebarContext = React.createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => {},
})

export const useSidebar = () => React.useContext(SidebarContext)

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, side, collapsed: collapsedProp = false, asChild = false, style, ...props }, ref) => {
    const [collapsed, setCollapsed] = React.useState<boolean>(!!collapsedProp)
    const Comp = asChild ? Slot : "div"

    return (
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <Comp
          ref={ref}
          className={cn(sidebarVariants({ variant, side, collapsed }), className)}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-collapsed": SIDEBAR_WIDTH_COLLAPSED,
              ...style,
            } as React.CSSProperties
          }
          data-sidebar="sidebar"
          {...props}
        />
      </SidebarContext.Provider>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0 px-6 py-4", className)} data-sidebar="header" {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "flex-1 overflow-auto px-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300", 
        className
      )} 
      data-sidebar="content" 
      {...props} 
    />
  ),
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0 px-6 py-4", className)} data-sidebar="footer" {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1.5", className)} data-sidebar="menu" {...props} />
  ),
)
SidebarMenu.displayName = "SidebarMenu"

const menuItemVariants = cva(
  "flex items-center gap-3 w-full rounded-md px-3.5 py-2.5 text-sm font-medium text-left transition-all duration-200 hover:bg-white/90 hover:text-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        active: "bg-white text-foreground font-medium shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const MenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
    icon?: React.ReactNode
    badge?: React.ReactNode
  }
>(({ className, active, icon, children, badge, ...props }, ref) => {
  const { collapsed } = useSidebar()

  return (
    <button
      ref={ref}
      className={cn(
        menuItemVariants({
          variant: active ? "active" : "default",
          className,
        }),
      )}
      {...props}
    >
      {icon}
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{children}</span>
          {badge}
        </>
      )}
    </button>
  )
})
MenuItem.displayName = "MenuItem"

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, MenuItem }
