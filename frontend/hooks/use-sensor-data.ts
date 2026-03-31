'use client'

import useSWR from 'swr'
import { DiagnosticResponse } from '@/lib/types'
import { AuthService } from '@/lib/auth-service'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://biosenseiot-production.up.railway.app'

// Datos estáticos de respaldo específicos para tus sensores MQ
const DEFAULT_DIAGNOSTIC: DiagnosticResponse = {
  diagnosticText: "Sistema en espera. Conecte su ESP32 para ver datos en tiempo real.",
  severity: "LOW",
  recommendation: "Asegúrese de que los sensores MQ estén precalentados.",
  timestamp: new Date().toISOString(),
  mq4: 0.0,   // Metano/Gas Natural
  mq7: 0.0,   // Monóxido de Carbono
  mq135: 0.0  // Calidad de Aire General
};

const fetcher = async (url: string) => {
  const token = AuthService.getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Error al cargar diagnóstico');
    }

    return await res.json();
  } catch (error) {
    console.warn('Usando datos de respaldo para MQ-Sensors');
    return null;
  }
}

export function useSensorData() {
  // Cambiamos el endpoint al de diagnósticos que maneja tus MQ
  const { data, error, isLoading, mutate } = useSWR<DiagnosticResponse | null>(
    '/api/diagnostics/latest',
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true
    }
  )

  const safeData = data || DEFAULT_DIAGNOSTIC;
  const isFallback = !data && !isLoading;

  return {
    data: safeData,
    isLoading,
    isError: !!error,
    isFallback,
    error,
    refresh: mutate
  }
}
