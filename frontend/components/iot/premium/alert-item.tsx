'use client'

import { cn } from '@/lib/utils'
import { Alert } from '@/lib/types'
import { AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface AlertItemProps {
  alert: Alert
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const alertTime = new Date(timestamp)
  const diffMs = now.getTime() - alertTime.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  return `Hace ${diffDays}d`
}

export function AlertItem({ alert }: AlertItemProps) {
  const Icon = alert.type === 'danger' ? AlertCircle : AlertTriangle
  
  return (
    <div className={cn(
      'flex items-start gap-3 rounded-lg border p-3 transition-all',
      alert.resolved ? 'opacity-60' : 'opacity-100',
      alert.type === 'danger' && !alert.resolved && 'border-red-500/30 bg-red-500/5',
      alert.type === 'warning' && !alert.resolved && 'border-amber-500/30 bg-amber-500/5',
      alert.resolved && 'border-border bg-card'
    )}>
      <div className={cn(
        'mt-0.5 rounded-full p-1.5',
        alert.type === 'danger' ? 'bg-red-500/10' : 'bg-amber-500/10'
      )}>
        <Icon className={cn(
          'h-4 w-4',
          alert.type === 'danger' ? 'text-red-500' : 'text-amber-500'
        )} />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{alert.message}</span>
          {alert.resolved && (
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn(
            'rounded px-1.5 py-0.5',
            alert.sensor === 'MQ4' && 'bg-blue-500/10 text-blue-400',
            alert.sensor === 'MQ7' && 'bg-purple-500/10 text-purple-400',
            alert.sensor === 'SISTEMA' && 'bg-gray-500/10 text-gray-400'
          )}>
            {alert.sensor}
          </span>
          {alert.value && (
            <span className={cn(
              alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'
            )}>
              {alert.value} ppm
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(alert.timestamp)}
          </span>
        </div>
      </div>
      
      <div className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        alert.resolved 
          ? 'bg-emerald-500/10 text-emerald-500' 
          : 'bg-red-500/10 text-red-500'
      )}>
        {alert.resolved ? 'Resuelto' : 'Activo'}
      </div>
    </div>
  )
}
