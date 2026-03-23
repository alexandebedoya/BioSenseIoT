"use client"

import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Bell, 
  Radio, 
  Lightbulb, 
  User, 
  LogOut,
  Wind,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ViewType = "dashboard" | "monitoreo" | "analisis" | "alertas" | "sensores" | "recomendaciones" | "perfil"

interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onLogout: () => void
}

const menuItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "monitoreo", label: "Monitoreo", icon: Activity },
  { id: "analisis", label: "Analisis", icon: BarChart3 },
  { id: "alertas", label: "Alertas", icon: Bell },
  { id: "sensores", label: "Sensores", icon: Radio },
  { id: "recomendaciones", label: "Recomendaciones IA", icon: Lightbulb },
  { id: "perfil", label: "Perfil", icon: User },
]

export function AppSidebar({ isOpen, onClose, currentView, onNavigate, onLogout }: AppSidebarProps) {
  const handleNavigate = (view: ViewType) => {
    onNavigate(view)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-sidebar z-50 shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="relative h-36 bg-gradient-to-br from-primary to-primary/80 p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                <Wind className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary-foreground">Monitoreo IoT</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  "animate-fade-in-up opacity-0",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>
    </>
  )
}
