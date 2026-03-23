"use client"

import { AlertTriangle, ChevronRight, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertCardProps {
  id: string
  title: string
  description: string
  location: string
  value?: string
  time: string
  severity: "critica" | "moderada" | "baja"
  resolved?: boolean
  delay?: number
  onClick?: () => void
}

const severityConfig = {
  critica: {
    label: "Critica",
    bg: "bg-status-danger/10",
    border: "border-status-danger/20",
    text: "text-status-danger",
    icon: "bg-status-danger/20 text-status-danger",
    badge: "bg-status-danger text-white"
  },
  moderada: {
    label: "Moderada",
    bg: "bg-status-warning/10",
    border: "border-status-warning/20",
    text: "text-status-warning",
    icon: "bg-status-warning/20 text-status-warning",
    badge: "bg-status-warning text-white"
  },
  baja: {
    label: "Baja",
    bg: "bg-status-info/10",
    border: "border-status-info/20",
    text: "text-status-info",
    icon: "bg-status-info/20 text-status-info",
    badge: "bg-status-info text-white"
  }
}

export function AlertCard({
  title,
  description,
  location,
  value,
  time,
  severity,
  resolved = false,
  delay = 0,
  onClick
}: AlertCardProps) {
  const config = severityConfig[severity]

  if (resolved) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 py-3 border-b border-border/30 last:border-0",
          "animate-fade-in-up opacity-0"
        )}
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      >
        <div className="w-8 h-8 rounded-full bg-status-safe/10 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 text-status-safe" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground/70">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl p-4 border transition-all duration-300",
        "hover:shadow-md active:scale-[0.98]",
        config.bg, config.border,
        "animate-fade-in-up opacity-0"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          config.icon
        )}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium",
              config.badge
            )}>
              {config.label}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {location}
            {value && <span className="font-medium"> - {value}</span>}
          </p>
          
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </button>
  )
}

// Notification toggle card
interface NotificationToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function NotificationToggle({ enabled, onToggle }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">Notificaciones Push</p>
          <p className="text-xs text-muted-foreground">Recibir alertas en tiempo real</p>
        </div>
      </div>
      
      <button
        onClick={() => onToggle(!enabled)}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors duration-300",
          enabled ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300",
            enabled && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}
