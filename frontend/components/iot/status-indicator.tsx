'use client'

import { cn } from '@/lib/utils'
import { AirQualityLevel } from '@/lib/types'

interface StatusIndicatorProps {
  level: AirQualityLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

const levelConfig = {
  NORMAL: {
    color: 'bg-emerald-500',
    glow: 'shadow-emerald-500/50',
    label: 'Aire Seguro',
    textColor: 'text-emerald-500'
  },
  PRECAUCION: {
    color: 'bg-amber-500',
    glow: 'shadow-amber-500/50',
    label: 'Precaución',
    textColor: 'text-amber-500'
  },
  PELIGRO: {
    color: 'bg-red-500',
    glow: 'shadow-red-500/50',
    label: 'Riesgo Alto',
    textColor: 'text-red-500'
  }
}

const sizeConfig = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6'
}

export function StatusIndicator({ 
  level, 
  size = 'md', 
  showLabel = false,
  animated = true 
}: StatusIndicatorProps) {
  const config = levelConfig[level]
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div 
          className={cn(
            'rounded-full',
            sizeConfig[size],
            config.color,
            animated && 'animate-pulse',
            'shadow-lg',
            config.glow
          )}
        />
        {animated && (
          <div 
            className={cn(
              'absolute inset-0 rounded-full',
              config.color,
              'animate-ping opacity-75'
            )}
          />
        )}
      </div>
      {showLabel && (
        <span className={cn('font-medium', config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

export function StatusBadge({ level }: { level: AirQualityLevel }) {
  const config = levelConfig[level]
  
  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
      'border',
      level === 'NORMAL' && 'border-emerald-500/30 bg-emerald-500/10',
      level === 'PRECAUCION' && 'border-amber-500/30 bg-amber-500/10',
      level === 'PELIGRO' && 'border-red-500/30 bg-red-500/10'
    )}>
      <StatusIndicator level={level} size="sm" animated={level !== 'NORMAL'} />
      <span className={cn('text-sm font-medium', config.textColor)}>
        {config.label}
      </span>
    </div>
  )
}
