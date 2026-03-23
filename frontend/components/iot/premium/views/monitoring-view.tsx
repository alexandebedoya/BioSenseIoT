"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { SensorStatusRow } from "../sensor-status-card"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  ReferenceLine
} from "recharts"
import { cn } from "@/lib/utils"
import type { SensorData } from "@/lib/types"

interface MonitoringViewProps {
  data: SensorData
}

const rooms = ["Sala", "Cocina", "Dormitorio", "Bano"]

const weeklyData = [
  { day: "Lun", CO: 35, CH4: 28, COVs: 22 },
  { day: "Mar", CO: 42, CH4: 32, COVs: 25 },
  { day: "Mie", CO: 38, CH4: 30, COVs: 24 },
  { day: "Jue", CO: 45, CH4: 35, COVs: 28 },
  { day: "Vie", CO: 48, CH4: 33, COVs: 26 },
  { day: "Sab", CO: 40, CH4: 29, COVs: 23 },
  { day: "Dom", CO: 50, CH4: 32, COVs: 25 }
]

const thresholds = {
  CO: { value: 50, max: 50 },
  CH4: { value: 100, max: 100 },
  COVs: { value: 80, max: 80 }
}

export function MonitoringView({ data }: MonitoringViewProps) {
  const [selectedRoom, setSelectedRoom] = useState("Sala")

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-4 pb-0">
        <h1 className="text-2xl font-bold tracking-tight">Monitoreo Detallado</h1>
      </div>

      {/* Room Selector */}
      <div className="p-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in-up">
          <p className="text-sm font-medium mb-3">Seleccionar Habitacion</p>
          <div className="flex flex-wrap gap-2">
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedRoom === room
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                )}
              >
                {selectedRoom === room && <Check className="w-4 h-4" />}
                {room}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Status */}
      <div className="px-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="font-semibold mb-3">Estado de Sensores</h3>
          <div>
            <SensorStatusRow 
              name="MQ-4 (Metano)" 
              type="Sensor de CH4" 
              status={data.mq4.status === "danger" ? "alerta" : "normal"} 
              online={true} 
            />
            <SensorStatusRow 
              name="MQ-7 (CO)" 
              type="Sensor de monoxido" 
              status={data.mq7.status === "danger" ? "alerta" : "normal"} 
              online={true} 
            />
            <SensorStatusRow 
              name="MQ-135 (COVs)" 
              type="Sensor de calidad" 
              status="normal" 
              online={true} 
            />
          </div>
        </div>
      </div>

      {/* CO Chart */}
      <div className="p-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Monoxido de Carbono (CO)</h3>
              <p className="text-xs text-muted-foreground">MQ-7</p>
            </div>
            <span className={cn(
              "text-2xl font-bold",
              data.mq7.status === "safe" && "text-status-safe",
              data.mq7.status === "warning" && "text-status-warning",
              data.mq7.status === "danger" && "text-status-danger"
            )}>
              {data.mq7.value.toFixed(1)} ppm
            </span>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  domain={[0, 60]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value} ppm`, 'CO']}
                />
                <ReferenceLine 
                  y={thresholds.CO.max} 
                  stroke="var(--status-danger)" 
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
                <Bar 
                  dataKey="CO" 
                  fill="var(--chart-1)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CH4 Chart */}
      <div className="px-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Metano (CH4)</h3>
              <p className="text-xs text-muted-foreground">MQ-4</p>
            </div>
            <span className={cn(
              "text-2xl font-bold",
              data.mq4.status === "safe" && "text-status-safe",
              data.mq4.status === "warning" && "text-status-warning",
              data.mq4.status === "danger" && "text-status-danger"
            )}>
              {data.mq4.value.toFixed(1)} ppm
            </span>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  domain={[0, 60]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value} ppm`, 'CH4']}
                />
                <Bar 
                  dataKey="CH4" 
                  fill="var(--chart-2)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* COVs Chart */}
      <div className="p-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Compuestos Organicos Volatiles</h3>
              <p className="text-xs text-muted-foreground">MQ-135</p>
            </div>
            <span className="text-2xl font-bold text-status-safe">28.0 ppm</span>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                  domain={[0, 40]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value} ppm`, 'COVs']}
                />
                <Bar 
                  dataKey="COVs" 
                  fill="var(--chart-3)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EPA/OMS Comparison */}
      <div className="px-4 pb-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="font-semibold mb-4">Comparativa con Umbrales EPA/OMS</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>CO</span>
                <span className="text-muted-foreground">{data.mq7.value.toFixed(1)} / 50.0 ppm</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-status-safe via-status-warning to-status-danger rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((data.mq7.value / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>CH4</span>
                <span className="text-muted-foreground">{data.mq4.value.toFixed(1)} / 100.0 ppm</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-status-safe via-status-warning to-status-danger rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((data.mq4.value / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>COVs</span>
                <span className="text-muted-foreground">28.0 / 80.0 ppm</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-status-safe via-status-warning to-status-danger rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((28 / 80) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
