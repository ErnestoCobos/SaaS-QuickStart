"use client"

import { ChevronRight, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import type React from "react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

interface BreadcrumbNavProps {
  items: {
    label: string
    href: string
    icon?: React.ComponentType
  }[]
}

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:h-3.5 [&>svg]:w-3.5", className)}
    {...props}
  >
    {children}
  </span>
)

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
        <Link href={items[0].href}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Go back</span>
        </Link>
      </Button>

      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            const Icon = item.icon

            return (
              <BreadcrumbItem key={item.href}>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {Icon && <Icon />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink
                      href={item.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      {Icon && <Icon />}
                      {item.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  </>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

