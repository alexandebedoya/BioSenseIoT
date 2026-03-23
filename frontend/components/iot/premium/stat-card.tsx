"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  unit?: string
  status?: "safe" | "warning" | "danger" | "info" | "neutral"
  trend?: "up" | "down" | "stable"
  trendValue?: string
  className?: string
  iconColor?: string
  delay?: number
}

const statusStyles = {
  safe: {
    icon: "bg-status-safe/10 text-status-safe",
    glow: "group-hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]"
  },
  warning: {
    icon: "bg-status-warning/10 text-status-warning",
    glow: "group-hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]"
  },
  danger: {
    icon: "bg-status-danger/10 text-status-danger",
    glow: "group-hover:shadow-[0_0_24px_rgba(239,68,68,0.15)]"
  },
  info: {
    icon: "bg-status-info/10 text-status-info",
    glow: "group-hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]"
  },
  neutral: {
    icon: "bg-muted text-muted-foreground",
    glow: ""
  }
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  status = "neutral",
  trend,
  trendValue,
  className,
  iconColor,
  delay = 0
}: StatCardProps) {
  const styles = statusStyles[status]

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-4",
        "transition-all duration-300 hover:border-border",
        "shadow-sm hover:shadow-premium",
        styles.glow,
        "animate-fade-in-up opacity-0",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
          iconColor || styles.icon
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-semibold tracking-tight">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 mt-1 text-xs",
              trend === "up" && "text-status-safe",
              trend === "down" && "text-status-danger",
              trend === "stable" && "text-muted-foreground"
            )}>
              {trend === "up" && <span>+</span>}
              {trend === "down" && <span>-</span>}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mini version for inline stats
interface MiniStatProps {
  icon: LucideIcon
  label: string
  value: string | number
  iconColor?: string
}

export function MiniStat({ icon: Icon, label, value, iconColor }: MiniStatProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50">
      <Icon className={cn("w-4 h-4", iconColor || "text-muted-foreground")} />
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">{label}:</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}
