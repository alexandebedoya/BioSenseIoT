"use client"

import { LayoutDashboard, Activity, BarChart3, Bell, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewType = "dashboard" | "monitoreo" | "analisis" | "alertas" | "sensores" | "recomendaciones" | "perfil"

interface BottomNavigationProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  alertCount?: number
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "monitoreo", label: "Monitoreo", icon: Activity },
  { id: "analisis", label: "Analisis", icon: BarChart3 },
  { id: "alertas", label: "Alertas", icon: Bell },
]

export function BottomNavigation({ currentView, onNavigate, alertCount = 0 }: BottomNavigationProps) {
  // Check if current view is one of the main nav items
  const isInMainNav = navItems.some(item => item.id === currentView)
  const moreActive = !isInMainNav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/30 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          const showBadge = item.id === "alertas" && alertCount > 0

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200",
                "active:scale-95",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -top-0.5 w-8 h-1 rounded-full bg-primary animate-scale-in" />
              )}
              
              <div className="relative">
                <Icon className={cn(
                  "w-5 h-5 transition-transform",
                  isActive && "scale-110"
                )} />
                
                {showBadge && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-status-danger text-white text-[10px] font-medium flex items-center justify-center">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </div>
              
              <span className={cn(
                "text-[10px] mt-1 font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}

        {/* More button */}
        <button
          onClick={() => onNavigate("sensores")}
          className={cn(
            "relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200",
            "active:scale-95",
            moreActive 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {moreActive && (
            <span className="absolute -top-0.5 w-8 h-1 rounded-full bg-primary animate-scale-in" />
          )}
          
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
            moreActive ? "bg-primary/10" : "bg-transparent"
          )}>
            <MoreHorizontal className={cn(
              "w-5 h-5",
              moreActive && "scale-110"
            )} />
          </div>
          
          <span className={cn(
            "text-[10px] mt-0.5 font-medium",
            moreActive ? "text-primary" : "text-muted-foreground"
          )}>
            Mas
          </span>
        </button>
      </div>
    </nav>
  )
}
