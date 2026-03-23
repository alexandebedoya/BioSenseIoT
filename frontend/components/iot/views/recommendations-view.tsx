'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SensorData } from '@/lib/types'
import { getRecommendations } from '@/lib/sensor-service'
import { 
  Lightbulb, 
  Wind, 
  AlertTriangle, 
  Shield, 
  ThermometerSun,
  Eye,
  Wrench,
  Phone
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecommendationsViewProps {
  data: SensorData | undefined
}

const iconMap = [
  Wind,
  Eye,
  ThermometerSun,
  Wrench,
  Shield,
  Phone,
  AlertTriangle,
  Lightbulb
]

export function RecommendationsView({ data }: RecommendationsViewProps) {
  if (!data) return null
  
  const recommendations = getRecommendations(data)
  
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Recomendaciones IA</h2>
      </div>
      
      {/* Status Card */}
      <Card className={cn(
        'border-2',
        data.nivel === 'NORMAL' && 'border-emerald-500/30 bg-emerald-500/5',
        data.nivel === 'PRECAUCION' && 'border-amber-500/30 bg-amber-500/5',
        data.nivel === 'PELIGRO' && 'border-red-500/30 bg-red-500/5'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'rounded-full p-3',
              data.nivel === 'NORMAL' && 'bg-emerald-500/20',
              data.nivel === 'PRECAUCION' && 'bg-amber-500/20',
              data.nivel === 'PELIGRO' && 'bg-red-500/20'
            )}>
              {data.nivel === 'NORMAL' ? (
                <Shield className="h-6 w-6 text-emerald-500" />
              ) : data.nivel === 'PRECAUCION' ? (
                <Eye className="h-6 w-6 text-amber-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div>
              <h3 className={cn(
                'font-semibold',
                data.nivel === 'NORMAL' && 'text-emerald-500',
                data.nivel === 'PRECAUCION' && 'text-amber-500',
                data.nivel === 'PELIGRO' && 'text-red-500'
              )}>
                {data.nivel === 'NORMAL' && 'Condiciones Óptimas'}
                {data.nivel === 'PRECAUCION' && 'Requiere Atención'}
                {data.nivel === 'PELIGRO' && 'Acción Inmediata Requerida'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Basado en lecturas actuales de sensores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations List */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = iconMap[index % iconMap.length]
          
          return (
            <Card 
              key={index}
              className={cn(
                'transition-all hover:shadow-md',
                index === 0 && data.nivel !== 'NORMAL' && 'border-l-4',
                index === 0 && data.nivel === 'PRECAUCION' && 'border-l-amber-500',
                index === 0 && data.nivel === 'PELIGRO' && 'border-l-red-500'
              )}
            >
              <CardContent className="flex items-start gap-3 py-4">
                <div className={cn(
                  'mt-0.5 rounded-lg p-2',
                  index === 0 && data.nivel !== 'NORMAL' 
                    ? data.nivel === 'PRECAUCION' 
                      ? 'bg-amber-500/10' 
                      : 'bg-red-500/10'
                    : 'bg-primary/10'
                )}>
                  <Icon className={cn(
                    'h-4 w-4',
                    index === 0 && data.nivel !== 'NORMAL'
                      ? data.nivel === 'PRECAUCION'
                        ? 'text-amber-500'
                        : 'text-red-500'
                      : 'text-primary'
                  )} />
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'text-sm',
                    index === 0 && data.nivel !== 'NORMAL' && 'font-medium'
                  )}>
                    {rec}
                  </p>
                  {index === 0 && data.nivel !== 'NORMAL' && (
                    <span className={cn(
                      'mt-1 inline-block text-xs',
                      data.nivel === 'PRECAUCION' ? 'text-amber-500' : 'text-red-500'
                    )}>
                      Prioridad alta
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Info Card */}
      <Card className="bg-secondary/50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Análisis Inteligente</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Las recomendaciones se actualizan automáticamente basándose en los niveles 
                actuales de MQ-4 (metano) y MQ-7 (monóxido de carbono) detectados por los sensores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
