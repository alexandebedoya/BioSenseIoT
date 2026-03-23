"use client"

import { cn } from "@/lib/utils"

interface AQIGaugeProps {
  value: number
  maxValue?: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  animated?: boolean
}

function getAQIStatus(value: number): { label: string; description: string; color: string; bgColor: string } {
  if (value <= 50) {
    return { 
      label: "Bueno", 
      description: "Excelente calidad del aire",
      color: "text-status-safe",
      bgColor: "from-status-safe to-emerald-400"
    }
  }
  if (value <= 100) {
    return { 
      label: "Moderado", 
      description: "Aceptable para la mayoria",
      color: "text-status-warning",
      bgColor: "from-status-warning to-amber-400"
    }
  }
  if (value <= 150) {
    return { 
      label: "Insalubre SG", 
      description: "Sensible para grupos vulnerables",
      color: "text-orange-500",
      bgColor: "from-orange-500 to-orange-400"
    }
  }
  return { 
    label: "Peligroso", 
    description: "Riesgo para la salud",
    color: "text-status-danger",
    bgColor: "from-status-danger to-red-400"
  }
}

export function AQIGauge({ 
  value, 
  maxValue = 200, 
  size = "lg",
  showLabel = true,
  animated = true 
}: AQIGaugeProps) {
  const status = getAQIStatus(value)
  const percentage = Math.min((value / maxValue) * 100, 100)
  
  // SVG dimensions
  const sizes = {
    sm: { width: 120, strokeWidth: 8, fontSize: "text-2xl", labelSize: "text-xs" },
    md: { width: 160, strokeWidth: 10, fontSize: "text-3xl", labelSize: "text-sm" },
    lg: { width: 200, strokeWidth: 12, fontSize: "text-5xl", labelSize: "text-base" }
  }
  
  const config = sizes[size]
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const arc = circumference * 0.75 // 270 degrees
  const offset = arc - (arc * percentage / 100)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Background track */}
        <svg 
          className="transform -rotate-[135deg]"
          width={config.width} 
          height={config.width}
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
            className="text-muted/30"
          />
          {/* Progress arc */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
            strokeDashoffset={offset}
            className={cn(animated && "animate-gauge-fill")}
            style={{ 
              transition: animated ? "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none"
            }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--status-safe)" />
              <stop offset="50%" stopColor="var(--status-warning)" />
              <stop offset="100%" stopColor="var(--status-danger)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(config.fontSize, "font-bold tracking-tight", status.color)}>
            {value}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">AQI</span>
        </div>
      </div>

      {/* Status label */}
      {showLabel && (
        <div className="mt-4 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className={cn("text-xl font-semibold", status.color)}>{status.label}</p>
          <p className="text-sm text-muted-foreground mt-1">{status.description}</p>
        </div>
      )}
    </div>
  )
}
