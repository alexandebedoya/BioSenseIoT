"use client"

import { useState } from "react"
import { AlertCard, NotificationToggle } from "../alert-card"
import { Button } from "@/components/ui/button"

const activeAlerts = [
  {
    id: "1",
    title: "Nivel de CO peligroso",
    description: "Ventile inmediatamente",
    location: "Cocina",
    value: "85 ppm",
    time: "Hace 2 minutos",
    severity: "critica" as const
  },
  {
    id: "2",
    title: "Nivel de CO elevado",
    description: "Revise la ventilacion",
    location: "Sala",
    value: "45 ppm",
    time: "Hace 5 minutos",
    severity: "moderada" as const
  },
  {
    id: "3",
    title: "Humedad alta",
    description: "Considere usar deshumidificador",
    location: "Bano",
    value: "78%",
    time: "Hace 15 minutos",
    severity: "baja" as const
  }
]

const alertHistory = [
  {
    id: "h1",
    title: "Nivel de CH4 elevado",
    description: "Cocina - 65 ppm",
    time: "Hace 2 horas"
  },
  {
    id: "h2",
    title: "Temperatura alta",
    description: "Sala - 28C",
    time: "Hace 5 horas"
  },
  {
    id: "h3",
    title: "Sensor desconectado",
    description: "MQ-135 - Dormitorio",
    time: "Ayer"
  },
  {
    id: "h4",
    title: "COVs detectados",
    description: "Garaje - 42 ppm",
    time: "Hace 2 dias"
  }
]

export function AlertsView() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-4 pb-0">
        <h1 className="text-2xl font-bold tracking-tight">Alertas y Notificaciones</h1>
      </div>

      {/* Notification Toggle */}
      <div className="p-4">
        <NotificationToggle 
          enabled={notificationsEnabled} 
          onToggle={setNotificationsEnabled} 
        />
      </div>

      {/* Active Alerts */}
      <div className="px-4">
        <h2 className="font-semibold text-lg mb-3">Alertas Activas</h2>
        <div className="space-y-3">
          {activeAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              {...alert}
              delay={index * 50}
            />
          ))}
        </div>
      </div>

      {/* Alert History */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Historial de Alertas</h2>
          <Button 
            variant="ghost" 
            className="text-primary text-sm font-medium h-auto p-0 hover:bg-transparent hover:text-primary/80"
          >
            Limpiar historial
          </Button>
        </div>
        
        <div className="bg-card rounded-2xl border border-border/50 p-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {alertHistory.map((alert, index) => (
            <AlertCard
              key={alert.id}
              id={alert.id}
              title={alert.title}
              description={alert.description}
              location=""
              time={alert.time}
              severity="baja"
              resolved
              delay={200 + index * 50}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
