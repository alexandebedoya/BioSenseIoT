"use client"

import { Menu, Bell, User, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title: string
  onMenuClick: () => void
  notificationCount?: number
}

export function AppHeader({ title, onMenuClick, notificationCount = 0 }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="rounded-xl hover:bg-secondary/80"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Wind className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm truncate max-w-[140px] sm:max-w-none">
              {title}
            </span>
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-secondary/80"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className={cn(
                "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full",
                "bg-destructive text-destructive-foreground text-xs font-medium",
                "flex items-center justify-center px-1",
                "animate-scale-in"
              )}>
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-secondary/80"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
              <User className="w-4 h-4 text-accent-foreground" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}
