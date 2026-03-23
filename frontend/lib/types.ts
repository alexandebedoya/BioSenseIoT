export type AirQualityLevel = 'NORMAL' | 'PRECAUCION' | 'PELIGRO'

export interface SensorData {
  mq4: number
  mq7: number
  nivel: AirQualityLevel
  timestamp: string
}

export interface Alert {
  id: string
  type: 'warning' | 'danger'
  message: string
  sensor: 'MQ4' | 'MQ7' | 'SISTEMA'
  timestamp: string
  resolved: boolean
  value?: number
}

export interface HistoricalDataPoint {
  timestamp: string
  mq4: number
  mq7: number
}

export interface SensorInfo {
  id: 'mq4' | 'mq7'
  name: string
  description: string
  unit: string
  safeMax: number
  warningMax: number
  icon: string
}

export const SENSOR_INFO: Record<'mq4' | 'mq7', SensorInfo> = {
  mq4: {
    id: 'mq4',
    name: 'MQ-4',
    description: 'Sensor de Metano (CH4)',
    unit: 'ppm',
    safeMax: 300,
    warningMax: 500,
    icon: 'flame'
  },
  mq7: {
    id: 'mq7',
    name: 'MQ-7',
    description: 'Sensor de Monóxido de Carbono (CO)',
    unit: 'ppm',
    safeMax: 200,
    warningMax: 400,
    icon: 'cloud'
  }
}

export const THRESHOLDS = {
  mq4: {
    safe: 300,
    warning: 500
  },
  mq7: {
    safe: 200,
    warning: 400
  }
}

export function getAirQualityLevel(mq4: number, mq7: number): AirQualityLevel {
  if (mq4 > THRESHOLDS.mq4.warning || mq7 > THRESHOLDS.mq7.warning) {
    return 'PELIGRO'
  }
  if (mq4 > THRESHOLDS.mq4.safe || mq7 > THRESHOLDS.mq7.safe) {
    return 'PRECAUCION'
  }
  return 'NORMAL'
}

export function getSensorStatus(value: number, sensor: 'mq4' | 'mq7'): AirQualityLevel {
  const threshold = THRESHOLDS[sensor]
  if (value > threshold.warning) return 'PELIGRO'
  if (value > threshold.safe) return 'PRECAUCION'
  return 'NORMAL'
}
