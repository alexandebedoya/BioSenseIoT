'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Power, CheckCircle2, Loader2, Search } from 'lucide-react'

async function linkDeviceAuto() {
  const token = localStorage.getItem('auth_token')
  if (!token) throw new Error('No autenticado')

  const response = await fetch('https://biosenseiot-production.up.railway.app/api/devices/link-auto', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'No se encontró el dispositivo. Asegúrate de que el ESP32 esté encendido.');
  }
  return response.json();
}

export function DeviceLinkCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLinked, setIsLinked] = useState(false)

  const handleAutoLink = async () => {
    setIsLoading(true)
    try {
      const result = await linkDeviceAuto()
      toast.success('¡BioSense Encontrado!', { description: result.message })
      setIsLinked(true)
      setTimeout(() => window.location.reload(), 2000)
    } catch (error: any) {
      toast.error('Error de Sincronización', { description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
      {/* Efecto de pulso si está cargando */}
      {isLoading && (
        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Power className={isLinked ? "text-green-400" : "text-primary"} />
          Estado del Hardware
        </CardTitle>
        <CardDescription className="text-slate-400">
          Presiona para buscar y sincronizar tu sensor cercano
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!isLinked ? (
          <Button 
            className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 rounded-2xl gap-3 transition-all active:scale-95" 
            onClick={handleAutoLink}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                BUSCANDO...
              </>
            ) : (
              <>
                <Search size={24} />
                SINCRONIZAR AHORA
              </>
            )}
          </Button>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 space-y-2 animate-in zoom-in-95">
            <div className="p-3 bg-green-500/20 rounded-full">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <p className="font-bold text-green-400">DISPOSITIVO VINCULADO</p>
          </div>
        )}
        
        <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest font-medium">
          Asegúrate que el ESP32 tenga el LED Verde encendido
        </p>
      </CardContent>
    </Card>
  )
}
