'use client'

import { cn } from '@/lib/utils'
import { AirQualityLevel, getSensorStatus } from '@/lib/types'

interface GaugeChartProps {
  value: number
  maxValue: number
  sensor: 'mq4' | 'mq7'
  label: string
  unit?: string
}

export function GaugeChart({ value, maxValue, sensor, label, unit = 'ppm' }: GaugeChartProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const status = getSensorStatus(value, sensor)
  
  const getColor = (status: AirQualityLevel) => {
    switch (status) {
      case 'NORMAL': return { stroke: '#22c55e', bg: 'from-emerald-500/20 to-emerald-500/5' }
      case 'PRECAUCION': return { stroke: '#eab308', bg: 'from-amber-500/20 to-amber-500/5' }
      case 'PELIGRO': return { stroke: '#ef4444', bg: 'from-red-500/20 to-red-500/5' }
    }
  }
  
  const colors = getColor(status)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-[135deg]" viewBox="0 0 100 100">
          {/* Background arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            className="text-secondary"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${colors.stroke})`
            }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className={cn(
              'text-2xl font-bold tabular-nums transition-colors duration-300',
              status === 'NORMAL' && 'text-emerald-500',
              status === 'PRECAUCION' && 'text-amber-500',
              status === 'PELIGRO' && 'text-red-500'
            )}
          >
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
