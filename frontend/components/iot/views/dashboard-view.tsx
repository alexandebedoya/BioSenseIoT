'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '../status-indicator'
import { GaugeChart } from '../gauge-chart'
import { SensorCard } from '../sensor-card'
import { SensorData, THRESHOLDS, getRecommendations } from '@/lib/types'
import { getRecommendations as getAIRecommendations } from '@/lib/sensor-service'
import { Wind, Clock, Lightbulb, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardViewProps {
  data: SensorData | undefined
  isLoading: boolean
  isError: boolean
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function DashboardView({ data, isLoading, isError }: DashboardViewProps) {
  if (isLoading && !data) {
    return <DashboardSkeleton />
  }
  
  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-red-500/10 p-4">
          <RefreshCw className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Error de conexión</h3>
          <p className="text-sm text-muted-foreground">No se pueden obtener los datos de los sensores</p>
        </div>
      </div>
    )
  }
  
  if (!data) return null
  
  const recommendations = getAIRecommendations(data)
  
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Main Status Card */}
      <Card className={cn(
        'relative overflow-hidden border-2 transition-colors duration-500',
        data.nivel === 'NORMAL' && 'border-emerald-500/30',
        data.nivel === 'PRECAUCION' && 'border-amber-500/30',
        data.nivel === 'PELIGRO' && 'border-red-500/30'
      )}>
        {/* Background glow effect */}
        <div className={cn(
          'pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl transition-colors duration-500',
          data.nivel === 'NORMAL' && 'bg-emerald-500/20',
          data.nivel === 'PRECAUCION' && 'bg-amber-500/20',
          data.nivel === 'PELIGRO' && 'bg-red-500/30'
        )} />
        
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Estado del Aire</CardTitle>
            </div>
            <StatusBadge level={data.nivel} />
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="flex items-center justify-around py-4">
            <GaugeChart 
              value={data.mq4} 
              maxValue={THRESHOLDS.mq4.warning * 1.5}
              sensor="mq4"
              label="Metano (MQ-4)"
            />
            <GaugeChart 
              value={data.mq7} 
              maxValue={THRESHOLDS.mq7.warning * 1.5}
              sensor="mq7"
              label="CO (MQ-7)"
            />
          </div>
          
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Última actualización: {formatTime(data.timestamp)}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <SensorCard 
          sensorId="mq4" 
          value={data.mq4}
          trend={data.mq4 > 250 ? 'up' : 'down'}
        />
        <SensorCard 
          sensorId="mq7" 
          value={data.mq7}
          trend={data.mq7 > 180 ? 'up' : 'down'}
        />
      </div>
      
      {/* AI Recommendations Preview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm">Recomendación IA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className={cn(
            'text-sm',
            data.nivel === 'NORMAL' && 'text-emerald-400',
            data.nivel === 'PRECAUCION' && 'text-amber-400',
            data.nivel === 'PELIGRO' && 'text-red-400'
          )}>
            {recommendations[0]}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-around py-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          <Skeleton className="mx-auto mt-2 h-4 w-48" />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
