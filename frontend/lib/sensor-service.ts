import { SensorData, Alert, HistoricalDataPoint, getAirQualityLevel, THRESHOLDS } from './types'

// Simulate realistic sensor data with some variance
function generateSensorValue(base: number, variance: number): number {
  return Math.round(base + (Math.random() - 0.5) * variance)
}

// Generate mock historical data for the last 24 hours
export function generateHistoricalData(hours: number = 24): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  const now = new Date()
  
  for (let i = hours * 60; i >= 0; i -= 5) {
    const timestamp = new Date(now.getTime() - i * 60 * 1000)
    const hourOfDay = timestamp.getHours()
    
    // Simulate daily patterns - higher readings during morning/evening
    const timeMultiplier = hourOfDay >= 7 && hourOfDay <= 9 ? 1.3 :
                          hourOfDay >= 18 && hourOfDay <= 21 ? 1.2 : 1
    
    data.push({
      timestamp: timestamp.toISOString(),
      mq4: generateSensorValue(200 * timeMultiplier, 80),
      mq7: generateSensorValue(120 * timeMultiplier, 60)
    })
  }
  
  return data
}

// Generate current sensor reading
export function generateCurrentReading(): SensorData {
  const mq4 = generateSensorValue(230, 150)
  const mq7 = generateSensorValue(155, 100)
  
  return {
    mq4,
    mq7,
    nivel: getAirQualityLevel(mq4, mq7),
    timestamp: new Date().toISOString()
  }
}

// Generate mock alerts
export function generateAlerts(): Alert[] {
  const now = new Date()
  
  return [
    {
      id: '1',
      type: 'danger',
      message: 'Nivel de CO elevado detectado',
      sensor: 'MQ7',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      resolved: true,
      value: 450
    },
    {
      id: '2',
      type: 'warning',
      message: 'Nivel de metano en zona de precaución',
      sensor: 'MQ4',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      resolved: false,
      value: 380
    },
    {
      id: '3',
      type: 'danger',
      message: 'Concentración peligrosa de metano',
      sensor: 'MQ4',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      resolved: true,
      value: 620
    },
    {
      id: '4',
      type: 'warning',
      message: 'Sensor MQ-7 requiere calibración',
      sensor: 'SISTEMA',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      resolved: true
    }
  ]
}

// Get AI recommendations based on current readings
export function getRecommendations(data: SensorData): string[] {
  const recommendations: string[] = []
  
  if (data.nivel === 'PELIGRO') {
    recommendations.push('Evacuar el área inmediatamente')
    recommendations.push('Activar sistema de ventilación de emergencia')
    recommendations.push('Contactar servicios de emergencia si es necesario')
    recommendations.push('No utilizar equipos eléctricos o llamas')
  } else if (data.nivel === 'PRECAUCION') {
    recommendations.push('Ventilar el área abriendo ventanas y puertas')
    recommendations.push('Evitar exposición prolongada en la zona')
    recommendations.push('Verificar posibles fuentes de emisión')
    recommendations.push('Monitorear la tendencia de los valores')
  } else {
    recommendations.push('Condiciones de aire óptimas')
    recommendations.push('Mantener ventilación regular')
    recommendations.push('Realizar mantenimiento preventivo de sensores')
    recommendations.push('Revisar calibración mensualmente')
  }
  
  return recommendations
}

// Calculate statistics from historical data
export function calculateStats(data: HistoricalDataPoint[]) {
  if (data.length === 0) return null
  
  const mq4Values = data.map(d => d.mq4)
  const mq7Values = data.map(d => d.mq7)
  
  return {
    mq4: {
      avg: Math.round(mq4Values.reduce((a, b) => a + b, 0) / mq4Values.length),
      max: Math.max(...mq4Values),
      min: Math.min(...mq4Values),
      trend: mq4Values[mq4Values.length - 1] > mq4Values[0] ? 'up' : 'down'
    },
    mq7: {
      avg: Math.round(mq7Values.reduce((a, b) => a + b, 0) / mq7Values.length),
      max: Math.max(...mq7Values),
      min: Math.min(...mq7Values),
      trend: mq7Values[mq7Values.length - 1] > mq7Values[0] ? 'up' : 'down'
    }
  }
}
