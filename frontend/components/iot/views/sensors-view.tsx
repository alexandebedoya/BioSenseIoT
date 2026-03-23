'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SensorCard } from '../sensor-card'
import { SensorData, SENSOR_INFO, THRESHOLDS, HistoricalDataPoint } from '@/lib/types'
import { generateHistoricalData, calculateStats } from '@/lib/sensor-service'
import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SensorsViewProps {
  data: SensorData | undefined
}

export function SensorsView({ data }: SensorsViewProps) {
  const historicalData = useMemo(() => generateHistoricalData(6), [])
  const stats = useMemo(() => calculateStats(historicalData), [historicalData])
  
  const chartData = useMemo(() => {
    return historicalData.slice(-24).map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      mq4: item.mq4,
      mq7: item.mq7
    }))
  }, [historicalData])
  
  if (!data) return null
  
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Monitoreo de Sensores</h2>
      </div>
      
      {/* Detailed Sensor Cards */}
      <div className="space-y-3">
        <SensorCard 
          sensorId="mq4" 
          value={data.mq4}
          trend={stats?.mq4.trend === 'up' ? 'up' : 'down'}
          showDetails
        />
        <SensorCard 
          sensorId="mq7" 
          value={data.mq7}
          trend={stats?.mq7.trend === 'up' ? 'up' : 'down'}
          showDetails
        />
      </div>
      
      {/* Historical Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Histórico (últimas 2 horas)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <ReferenceLine 
                  y={THRESHOLDS.mq4.safe} 
                  stroke="#22c55e" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5}
                />
                <ReferenceLine 
                  y={THRESHOLDS.mq7.warning} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5}
                />
                <Line 
                  type="monotone" 
                  dataKey="mq4" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  name="MQ-4"
                />
                <Line 
                  type="monotone" 
                  dataKey="mq7" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  dot={false}
                  name="MQ-7"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-3 flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-4 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">MQ-4 (Metano)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-4 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">MQ-7 (CO)</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Estadísticas (6h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <StatBlock 
                label="MQ-4"
                avg={stats.mq4.avg}
                max={stats.mq4.max}
                min={stats.mq4.min}
                trend={stats.mq4.trend}
                color="blue"
              />
              <StatBlock 
                label="MQ-7"
                avg={stats.mq7.avg}
                max={stats.mq7.max}
                min={stats.mq7.min}
                trend={stats.mq7.trend}
                color="purple"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatBlock({ 
  label, 
  avg, 
  max, 
  min, 
  trend,
  color
}: { 
  label: string
  avg: number
  max: number
  min: number
  trend: 'up' | 'down'
  color: 'blue' | 'purple'
}) {
  return (
    <div className={cn(
      'rounded-lg border p-3',
      color === 'blue' ? 'border-blue-500/20 bg-blue-500/5' : 'border-purple-500/20 bg-purple-500/5'
    )}>
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-sm font-medium',
          color === 'blue' ? 'text-blue-400' : 'text-purple-400'
        )}>{label}</span>
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-red-400" />
        ) : (
          <TrendingDown className="h-4 w-4 text-emerald-400" />
        )}
      </div>
      <div className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Promedio</span>
          <span className="font-mono">{avg} ppm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Máximo</span>
          <span className="font-mono text-red-400">{max} ppm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mínimo</span>
          <span className="font-mono text-emerald-400">{min} ppm</span>
        </div>
      </div>
    </div>
  )
}
