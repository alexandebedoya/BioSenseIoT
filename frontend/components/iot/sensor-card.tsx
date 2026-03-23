'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { SENSOR_INFO, getSensorStatus, AirQualityLevel } from '@/lib/types'
import { StatusIndicator } from './status-indicator'
import { Flame, Cloud, TrendingUp, TrendingDown } from 'lucide-react'

interface SensorCardProps {
  sensorId: 'mq4' | 'mq7'
  value: number
  trend?: 'up' | 'down' | 'stable'
  showDetails?: boolean
}

export function SensorCard({ sensorId, value, trend = 'stable', showDetails = false }: SensorCardProps) {
  const info = SENSOR_INFO[sensorId]
  const status = getSensorStatus(value, sensorId)
  
  const Icon = sensorId === 'mq4' ? Flame : Cloud
  
  const getStatusColor = (status: AirQualityLevel) => {
    switch (status) {
      case 'NORMAL': return 'text-emerald-500'
      case 'PRECAUCION': return 'text-amber-500'
      case 'PELIGRO': return 'text-red-500'
    }
  }
  
  const getBorderColor = (status: AirQualityLevel) => {
    switch (status) {
      case 'NORMAL': return 'border-emerald-500/20'
      case 'PRECAUCION': return 'border-amber-500/20'
      case 'PELIGRO': return 'border-red-500/20'
    }
  }
  
  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg',
      getBorderColor(status)
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            'rounded-lg p-2',
            status === 'NORMAL' && 'bg-emerald-500/10',
            status === 'PRECAUCION' && 'bg-amber-500/10',
            status === 'PELIGRO' && 'bg-red-500/10'
          )}>
            <Icon className={cn('h-4 w-4', getStatusColor(status))} />
          </div>
          <CardTitle className="text-sm font-medium">{info.name}</CardTitle>
        </div>
        <StatusIndicator level={status} size="sm" animated={status !== 'NORMAL'} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn(
            'text-3xl font-bold tabular-nums transition-colors duration-300',
            getStatusColor(status)
          )}>
            {value}
          </span>
          <span className="text-sm text-muted-foreground">{info.unit}</span>
          {trend !== 'stable' && (
            <div className={cn(
              'ml-auto flex items-center gap-1 text-xs',
              trend === 'up' ? 'text-red-400' : 'text-emerald-400'
            )}>
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
        {showDetails && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted-foreground">{info.description}</p>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Umbral seguro</span>
              <span className="text-emerald-500">{'<'} {info.safeMax} {info.unit}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Umbral peligro</span>
              <span className="text-red-500">{'>'} {info.warningMax} {info.unit}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
