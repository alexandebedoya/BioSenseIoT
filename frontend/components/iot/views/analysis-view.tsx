'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateHistoricalData, calculateStats } from '@/lib/sensor-service'
import { THRESHOLDS } from '@/lib/types'
import { useMemo, useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts'
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type TimeRange = '6h' | '12h' | '24h'

export function AnalysisView() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  
  const hours = timeRange === '6h' ? 6 : timeRange === '12h' ? 12 : 24
  const historicalData = useMemo(() => generateHistoricalData(hours), [hours])
  const stats = useMemo(() => calculateStats(historicalData), [historicalData])
  
  const chartData = useMemo(() => {
    const interval = Math.floor(historicalData.length / 24)
    return historicalData
      .filter((_, i) => i % interval === 0)
      .map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        mq4: item.mq4,
        mq7: item.mq7
      }))
  }, [historicalData])
  
  // Detect peaks
  const peaks = useMemo(() => {
    const mq4Peaks = historicalData.filter(d => d.mq4 > THRESHOLDS.mq4.safe)
    const mq7Peaks = historicalData.filter(d => d.mq7 > THRESHOLDS.mq7.safe)
    return {
      mq4: mq4Peaks.length,
      mq7: mq7Peaks.length
    }
  }, [historicalData])
  
  // Hourly distribution for bar chart
  const hourlyData = useMemo(() => {
    const hourlyAvg: { [key: string]: { mq4: number[], mq7: number[] } } = {}
    
    historicalData.forEach(item => {
      const hour = new Date(item.timestamp).getHours()
      const key = `${hour.toString().padStart(2, '0')}:00`
      if (!hourlyAvg[key]) {
        hourlyAvg[key] = { mq4: [], mq7: [] }
      }
      hourlyAvg[key].mq4.push(item.mq4)
      hourlyAvg[key].mq7.push(item.mq7)
    })
    
    return Object.entries(hourlyAvg).map(([hour, values]) => ({
      hour,
      mq4: Math.round(values.mq4.reduce((a, b) => a + b, 0) / values.mq4.length),
      mq7: Math.round(values.mq7.reduce((a, b) => a + b, 0) / values.mq7.length)
    })).slice(-8)
  }, [historicalData])
  
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Análisis</h2>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['6h', '12h', '24h'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              timeRange === range 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {range}
          </button>
        ))}
      </div>
      
      {/* Statistics Summary */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="MQ-4 Promedio"
            value={stats.mq4.avg}
            unit="ppm"
            trend={stats.mq4.trend}
            color="blue"
          />
          <StatCard
            title="MQ-7 Promedio"
            value={stats.mq7.avg}
            unit="ppm"
            trend={stats.mq7.trend}
            color="purple"
          />
        </div>
      )}
      
      {/* Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Tendencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradientMQ4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradientMQ7" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                />
                <Area 
                  type="monotone" 
                  dataKey="mq4" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#gradientMQ4)"
                  name="MQ-4"
                />
                <Area 
                  type="monotone" 
                  dataKey="mq7" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fill="url(#gradientMQ7)"
                  name="MQ-7"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Hourly Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Distribución por Hora</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
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
                />
                <Bar dataKey="mq4" fill="#3b82f6" radius={[4, 4, 0, 0]} name="MQ-4" />
                <Bar dataKey="mq7" fill="#a855f7" radius={[4, 4, 0, 0]} name="MQ-7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Peaks Detected */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-sm">Picos Detectados</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{peaks.mq4}</p>
              <p className="text-xs text-muted-foreground">MQ-4 {'>'} {THRESHOLDS.mq4.safe} ppm</p>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{peaks.mq7}</p>
              <p className="text-xs text-muted-foreground">MQ-7 {'>'} {THRESHOLDS.mq7.safe} ppm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  unit, 
  trend,
  color
}: { 
  title: string
  value: number
  unit: string
  trend: 'up' | 'down'
  color: 'blue' | 'purple'
}) {
  return (
    <Card className={cn(
      'border',
      color === 'blue' ? 'border-blue-500/20' : 'border-purple-500/20'
    )}>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className={cn(
            'text-2xl font-bold',
            color === 'blue' ? 'text-blue-400' : 'text-purple-400'
          )}>
            {value}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
          {trend === 'up' ? (
            <TrendingUp className="ml-auto h-4 w-4 text-red-400" />
          ) : (
            <TrendingDown className="ml-auto h-4 w-4 text-emerald-400" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
