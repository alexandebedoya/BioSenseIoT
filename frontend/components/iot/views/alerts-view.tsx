'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertItem } from '../alert-item'
import { generateAlerts } from '@/lib/sensor-service'
import { useMemo, useState } from 'react'
import { Bell, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'active' | 'resolved'

export function AlertsView() {
  const alerts = useMemo(() => generateAlerts(), [])
  const [filter, setFilter] = useState<FilterType>('all')
  
  const filteredAlerts = useMemo(() => {
    switch (filter) {
      case 'active':
        return alerts.filter(a => !a.resolved)
      case 'resolved':
        return alerts.filter(a => a.resolved)
      default:
        return alerts
    }
  }, [alerts, filter])
  
  const activeCount = alerts.filter(a => !a.resolved).length
  
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Alertas</h2>
          {activeCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'resolved'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Resueltas'}
          </button>
        ))}
      </div>
      
      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No hay alertas {filter === 'active' ? 'activas' : filter === 'resolved' ? 'resueltas' : ''}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))
        )}
      </div>
      
      {/* Summary Card */}
      <Card className="bg-secondary/50">
        <CardContent className="py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{alerts.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Activas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-500">{alerts.length - activeCount}</p>
              <p className="text-xs text-muted-foreground">Resueltas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
