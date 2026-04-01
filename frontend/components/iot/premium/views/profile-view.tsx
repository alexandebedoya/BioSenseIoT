"use client"

import { useState } from "react"
import { 
  User, 
  Pencil, 
  Users, 
  PawPrint, 
  Home, 
  Moon, 
  Globe, 
  Ruler,
  LogOut,
  ChevronDown,
  Bell,
  Smartphone,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { DeviceLinkCard } from "../device-link-card"
import { AuthService } from "@/lib/auth-service"

export function ProfileView() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState("Español")
  
  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-4 pb-0">
        <h1 className="text-2xl font-bold tracking-tight">Mi BioSense</h1>
      </div>

      {/* User Card */}
      <div className="p-4">
        <div className="bg-card rounded-3xl border border-border/50 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
              AC
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg">Alex Colimba</h2>
              <p className="text-sm text-muted-foreground truncate">alexis10129706@gmail.com</p>
            </div>
            <Button variant="secondary" size="icon" className="rounded-xl">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* HARDWARE: La sección más importante para el usuario */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Vinculación de Hardware</h2>
        </div>
        <DeviceLinkCard />
      </div>

      {/* CONFIGURACIÓN: Agrupada por funcionalidad */}
      <div className="px-4 space-y-6">
        
        {/* Notificaciones y Preferencias */}
        <section>
          <h2 className="font-bold text-lg mb-3 px-1">Preferencias</h2>
          <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
            
            {/* Modo Oscuro */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Moon className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium">Modo Oscuro</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Notificaciones */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bell className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium">Alertas Críticas</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {/* Idioma */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Globe className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-sm font-medium">Idioma</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-primary">
                {language} <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Seguridad y Sistema */}
        <section>
          <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-4 border-b border-border/30 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-sm font-medium">Seguridad de la cuenta</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
            </button>
            <div className="p-4 bg-slate-50/50">
              <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-tighter">
                BioSense IoT Monitor • Versión 2.0.4 PRO
              </p>
            </div>
          </div>
        </section>

        {/* Botón de Salida */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full h-14 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold gap-2"
          >
            <LogOut className="w-5 h-5" />
            CERRAR SESIÓN
          </Button>
        </div>
      </div>
    </div>
  )
}
