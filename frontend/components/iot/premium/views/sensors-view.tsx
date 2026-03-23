"use client"

import { Plus } from "lucide-react"
import { SensorStatusCard } from "../sensor-status-card"
import { Button } from "@/components/ui/button"

const sensors = [
  {
    id: "mq4",
    name: "MQ-4",
    type: "Sensor de Metano",
    status: "online" as const,
    location: "Cocina",
    battery: 95,
    firmware: "v2.1.0"
  },
  {
    id: "mq7",
    name: "MQ-7",
    type: "Sensor de CO",
    status: "online" as const,
    location: "Sala",
    battery: 88,
    firmware: "v2.1.0"
  },
  {
    id: "mq135",
    name: "MQ-135",
    type: "Sensor de COVs",
    status: "online" as const,
    location: "Dormitorio",
    battery: 72,
    firmware: "v2.0.5"
  }
]

export function SensorsView() {
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-4 pb-0 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestion de Sensores</h1>
        <Button className="rounded-xl gap-2">
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </div>

      {/* Sensor Cards */}
      <div className="p-4 space-y-4">
        {sensors.map((sensor, index) => (
          <SensorStatusCard
            key={sensor.id}
            {...sensor}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  )
}
