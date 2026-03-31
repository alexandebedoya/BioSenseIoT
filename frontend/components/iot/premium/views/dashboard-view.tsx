'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '../../status-indicator'
import { GaugeChart } from '../../gauge-chart'
import { SensorCard } from '../../sensor-card'
import { DiagnosticResponse } from '@/lib/types'
import { Clock, RefreshCw, Cpu, PlusCircle, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DashboardViewProps {
  data: DiagnosticResponse | null | undefined
  isLoading: boolean
  isError: boolean
  onNavigateToProfile?: () => void
  onNavigateToAlerts?: () => void
  onNavigateToRecommendations?: () => void
}

function formatTime(timestamp?: string): string {
  if (!timestamp) return 'Sincronizando...';
  try {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Hora no válida';
  }
}

export function DashboardView({ 
  data, 
  isLoading, 
  isError, 
  onNavigateToProfile 
}: DashboardViewProps) {
  
  if (isLoading) return <DashboardSkeleton />;
  
  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <RefreshCw className="h-12 w-12 text-red-500 animate-spin" />
        <h3 className="font-bold text-lg text-slate-800">Error de conexión</h3>
        <p className="text-sm text-slate-500">No pudimos conectar con el servidor de BioSense.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 space-y-6 animate-in fade-in duration-700">
        <Card className="border-dashed border-2 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="p-6 bg-white rounded-full shadow-inner shadow-primary/10">
              <Cpu size={48} className="text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Bienvenido a BioSense</h3>
              <p className="text-sm text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                Tu sistema de monitoreo está listo. Solo falta vincular tu hardware para empezar.
              </p>
            </div>
            <Button 
              className="h-14 px-8 text-base font-bold shadow-xl shadow-primary/20 rounded-2xl gap-2 active:scale-95 transition-transform"
              onClick={onNavigateToProfile}
            >
              <PlusCircle size={20} />
              ACTIVAR MI BIOSENSE
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nivel = data.severity || 'LOW';
  const severityMap: Record<string, 'NORMAL' | 'PRECAUCION' | 'PELIGRO'> = {
    'LOW': 'NORMAL',
    'MEDIUM': 'PRECAUCION',
    'HIGH': 'PELIGRO',
    'CRITICAL': 'PELIGRO' // Evitamos 'CRÍTICO' porque no existe en StatusIndicator
  };


  return (
    <div className="p-4 space-y-4 animate-in slide-in-from-bottom-2 duration-500">
      <Card className={cn(
        'relative overflow-hidden border-none shadow-2xl transition-all duration-1000 rounded-3xl',
        nivel === 'LOW' && 'bg-emerald-50 text-emerald-900',
        nivel === 'MEDIUM' && 'bg-amber-50 text-amber-900',
        nivel === 'HIGH' && 'bg-orange-50 text-orange-900',
        nivel === 'CRITICAL' && 'bg-red-50 text-red-900'
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Diagnóstico IA</span>
            <StatusBadge level={severityMap[nivel] || 'NORMAL'} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight leading-tight">
            {data.diagnosticText || "Analizando calidad del aire..."}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-around items-end py-6 gap-2">
            <GaugeChart value={data.mq4} sensor="mq4" label="CH4 (MQ4)" />
            <GaugeChart value={data.mq7} sensor="mq7" label="CO (MQ7)" />
            <GaugeChart value={data.mq135} sensor="mq135" label="Aire (MQ135)" />
          </div>
          <div className="text-center text-[10px] opacity-50 font-medium">
            <Clock className="inline h-3 w-3 mr-1" />
            Sincronizado: {formatTime(data.timestamp)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Card className="border-none bg-slate-900 text-white rounded-3xl p-1 shadow-lg">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
              <ShieldCheck size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">Recomendación IA</p>
              <p className="text-sm leading-relaxed font-medium">{data.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <SensorCard sensorId="mq4" value={data.mq4} trend="stable" />
        <SensorCard sensorId="mq7" value={data.mq7} trend="stable" />
        <SensorCard sensorId="mq135" value={data.mq135} trend="stable" />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-64 w-full rounded-[40px]" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    </div>
  );
}
