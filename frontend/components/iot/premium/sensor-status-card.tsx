"use client"

import { Radio, MapPin, Battery, Code, Settings, MoreVertical, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SensorStatusCardProps {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "warning"
  location: string
  battery: number
  firmware: string
  delay?: number
}

export function SensorStatusCard({
  name,
  type,
  status,
  location,
  battery,
  firmware,
  delay = 0
}: SensorStatusCardProps) {
  const statusConfig = {
    online: { 
      label: "Online", 
      color: "text-status-safe", 
      bg: "bg-status-safe/10",
      dot: "bg-status-safe"
    },
    offline: { 
      label: "Offline", 
      color: "text-muted-foreground", 
      bg: "bg-muted",
      dot: "bg-muted-foreground"
    },
    warning: { 
      label: "Alerta", 
      color: "text-status-warning", 
      bg: "bg-status-warning/10",
      dot: "bg-status-warning"
    }
  }

  const config = statusConfig[status]
  const batteryColor = battery > 50 ? "text-status-safe" : battery > 20 ? "text-status-warning" : "text-status-danger"

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border/50",
        "transition-all duration-300 hover:border-border hover:shadow-premium",
        "animate-fade-in-up opacity-0"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
            config.bg
          )}>
            <Radio className={cn("w-6 h-6", config.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{name}</h3>
              <span className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                config.bg, config.color
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
                {config.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{type}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-px bg-border/30 border-t border-border/30">
        <div className="bg-card p-3 text-center">
          <MapPin className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Ubicacion</p>
          <p className="text-sm font-medium mt-0.5">{location}</p>
        </div>
        <div className="bg-card p-3 text-center">
          <Battery className={cn("w-4 h-4 mx-auto mb-1", batteryColor)} />
          <p className="text-xs text-muted-foreground">Bateria</p>
          <p className={cn("text-sm font-medium mt-0.5", batteryColor)}>{battery}%</p>
        </div>
        <div className="bg-card p-3 text-center">
          <Code className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Firmware</p>
          <p className="text-sm font-medium mt-0.5">{firmware}</p>
        </div>
      </div>

      {/* Action */}
      <div className="p-3 border-t border-border/30">
        <Button 
          variant="outline" 
          className="w-full rounded-xl border-border/50 hover:bg-secondary/50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Calibracion Manual
        </Button>
      </div>
    </div>
  )
}

// Compact sensor status for lists
interface SensorStatusRowProps {
  name: string
  type: string
  status: "normal" | "alerta"
  online: boolean
}

export function SensorStatusRow({ name, type, status, online }: SensorStatusRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          online ? "bg-status-safe/10" : "bg-muted"
        )}>
          <Check className={cn("w-4 h-4", online ? "text-status-safe" : "text-muted-foreground")} />
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{online ? "En linea" : "Desconectado"}</p>
        </div>
      </div>
      <span className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium",
        status === "normal" 
          ? "bg-status-safe/10 text-status-safe" 
          : "bg-status-danger/10 text-status-danger"
      )}>
        {status === "normal" ? "Normal" : "Alerta"}
      </span>
    </div>
  )
}
