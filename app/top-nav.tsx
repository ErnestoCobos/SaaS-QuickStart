"use client"

import { ChevronRight, ArrowLeft, FolderClosed, Settings2, Share2, MoreHorizontal, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function TopNav() {
  return (
    <div className="flex flex-col border-b bg-white">
      {/* Mobile view - top bar */}
      <div className="flex h-14 items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="font-medium">House Spectrum Ltd</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile view - metadata */}
      <div className="flex items-center gap-2 border-t px-4 py-2 lg:hidden">
        <Badge variant="outline" className="gap-1">
          <Settings2 className="h-3 w-3" />
          Certified
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <User className="h-3 w-3" />
          Jessica Parker
        </Badge>
        <span className="text-sm text-muted-foreground ml-auto">
          Edited 7 hrs ago
        </span>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 text-sm overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <FolderClosed className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">Projects</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <FolderClosed className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">Construction</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-2 min-w-0 shrink">
              <Settings2 className="h-4 w-4 shrink-0" />
              <span className="font-medium truncate">House Spectrum Ltd</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4 shrink-0">
          <Badge variant="outline" className="gap-1">
            <Settings2 className="h-3 w-3" />
            Certified
          </Badge>
          
          <Badge variant="secondary" className="gap-1">
            <User className="h-3 w-3" />
            Jessica Parker
          </Badge>
          
          <span className="text-sm text-muted-foreground">
            Edited 7 hrs ago
          </span>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Manage
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

