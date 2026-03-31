'use client'

import useSWR from 'swr'
import { SensorData } from '@/lib/types'
import { AuthService } from '@/lib/auth-service'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://biosenseiot-production.up.railway.app'

const fetcher = async (url: string) => {
  const token = AuthService.getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    if (res.status === 404) return null; // No hay lecturas aún
    throw new Error('Error al cargar datos de sensores');
  }

  return res.json();
}

export function useSensorData() {
  const { data, error, isLoading, mutate } = useSWR<SensorData | null>(
    '/api/sensors/latest',
    fetcher,
    {
      refreshInterval: 5000, // 5 segundos para ahorrar batería
      revalidateOnFocus: true
    }
  )

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate
  }
}
