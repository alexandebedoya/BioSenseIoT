'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '../status-indicator'
import { GaugeChart } from '../gauge-chart'
import { SensorCard } from '../sensor-card'
import { SensorData, THRESHOLDS } from '@/lib/types'
import { getRecommendations as getAIRecommendations } from '@/lib/sensor-service'
import { Wind, Clock, Lightbulb, RefreshCw, Cpu, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DashboardViewProps {
  data: SensorData | null | undefined
  isLoading: boolean
  isError: boolean
  onNavigateToProfile?: () => void // Prop de navegación opcional
}

function formatTime(timestamp?: string): string {
  if (!timestamp) return 'No disponible';
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function DashboardView({ data, isLoading, isError, onNavigateToProfile }: DashboardViewProps) {
  
  if (isLoading) {
    return <DashboardSkeleton />
  }
  
  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center p-6 bg-slate-50 rounded-3xl">
        <div className="rounded-full bg-red-500/10 p-4">
          <RefreshCw className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold">Error de sincronización</h3>
      </div>
    )
  }
  
  if (!data) {
    return (
      <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-dashed border-2 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="p-6 bg-primary/10 rounded-full text-primary">
              <Cpu size={48} className="animate-pulse" />
            </div>
            <div className="space-y-2 max-w-[280px]">
              <h3 className="text-xl font-bold tracking-tight">Tu BioSense está esperando</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aún no has vinculado un sensor a tu cuenta.
              </p>
            </div>
            <Button 
              className="h-12 px-8 text-base font-bold shadow-xl gap-2"
              onClick={onNavigateToProfile}
            >
              <PlusCircle size={20} />
              VINCULAR DISPOSITIVO
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const recommendations = getAIRecommendations(data)
  const nivel = data.nivel || 'NORMAL';
  
  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500">
      <Card className={cn(
        'relative overflow-hidden border-2 transition-colors duration-500',
        nivel === 'NORMAL' && 'border-emerald-500/30',
        nivel === 'PRECAUCION' && 'border-amber-500/30',
        nivel === 'PELIGRO' && 'border-red-500/30'
      )}>
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Estado del Aire</CardTitle>
            </div>
            <StatusBadge level={nivel} />
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="flex items-center justify-around py-4">
            <GaugeChart value={data.mq4 || 0} sensor="mq4" label="MQ-4" />
            <GaugeChart value={data.mq7 || 0} sensor="mq7" label="MQ-7" />
          </div>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            Actualizado: {formatTime(data.timestamp)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <SensorCard sensorId="mq4" value={data.mq4 || 0} trend="stable" />
        <SensorCard sensorId="mq7" value={data.mq7 || 0} trend="stable" />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return <div className="p-4 space-y-4"><Skeleton className="h-48 w-full rounded-3xl" /></div>
}
