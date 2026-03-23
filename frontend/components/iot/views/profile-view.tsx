'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function ProfileView() {
  const [notifications, setNotifications] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Perfil</h2>
      </div>
      
      {/* User Card */}
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">Juan Desarrollador</h3>
            <p className="text-sm text-muted-foreground">juan@ejemplo.com</p>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              Administrador
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
      
      {/* Notifications Settings */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Notificaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notificaciones push</p>
              <p className="text-xs text-muted-foreground">Recibir alertas en el dispositivo</p>
            </div>
            <Switch 
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Alertas críticas</p>
              <p className="text-xs text-muted-foreground">Notificar niveles peligrosos</p>
            </div>
            <Switch 
              checked={criticalAlerts}
              onCheckedChange={setCriticalAlerts}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sonido de alerta</p>
              <p className="text-xs text-muted-foreground">Reproducir sonido en alertas</p>
            </div>
            <Switch 
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Device Info */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Dispositivo IoT</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Modelo</span>
            <span>ESP32-WROOM-32</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Firmware</span>
            <span>v2.1.3</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Conectado
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Última calibración</span>
            <span>15/03/2026</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Menu Items */}
      <Card>
        <CardContent className="divide-y divide-border p-0">
          <MenuItem icon={Settings} label="Configuración" />
          <MenuItem icon={Shield} label="Seguridad" />
          <MenuItem icon={HelpCircle} label="Ayuda y soporte" />
          <MenuItem icon={Info} label="Acerca de" />
        </CardContent>
      </Card>
      
      {/* Logout Button */}
      <Button 
        variant="outline" 
        className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>
      
      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        AirQuality Monitor v1.0.0
      </p>
    </div>
  )
}

function MenuItem({ icon: Icon, label }: { icon: typeof Settings, label: string }) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}
