export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AirQualityLevel = 'NORMAL' | 'PRECAUCION' | 'PELIGRO';

export interface DiagnosticResponse {
  diagnosticText: string;
  severity: Severity;
  recommendation: string;
  timestamp: string;
  mq4: number;   // CH4/Gas Natural
  mq7: number;   // CO
  mq135: number; // Air Quality
}

export interface SensorValue {
  value: number;
  status: 'safe' | 'warning' | 'danger';
}

export interface SensorData {
  mq4: number;
  mq7: number;
  mq135: number;
  timestamp: string;
  nivel?: AirQualityLevel;
}

export interface HistoricalDataPoint {
  timestamp: string;
  mq4: number;
  mq7: number;
  mq135: number;
}

export interface Alert {
  id: string;
  sensor: 'MQ4' | 'MQ7' | 'MQ135' | 'SISTEMA';
  type: 'warning' | 'danger';
  message: string;
  value?: number;
  timestamp: string;
  resolved: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  healthConditions: string[];
  pets: PetProfile[];
}

export interface AuthResponse {
  accessToken: string;
  email: string;
  fullName: string;
}

export interface PetProfile {
  name: string;
  species: string;
  breed: string;
  vulnerabilities: string;
}

// --- NUEVAS DEFINICIONES PARA EVITAR ERRORES EN EL DASHBOARD ---

export const SENSOR_INFO: Record<string, { label: string; unit: string; icon: string; color: string; name?: string; description?: string; safeMax?: number; warningMax?: number }> = {
  mq4: { 
    label: 'Metano', 
    unit: 'ppm', 
    icon: 'Wind', 
    color: 'orange',
    name: 'Metano (MQ4)',
    description: 'Detección de gas natural y metano.',
    safeMax: 200,
    warningMax: 500
  },
  mq7: { 
    label: 'Monóxido', 
    unit: 'ppm', 
    icon: 'Activity', 
    color: 'red',
    name: 'Monóxido (MQ7)',
    description: 'Detección de monóxido de carbono.',
    safeMax: 50,
    warningMax: 100
  },
  mq135: { 
    label: 'Calidad Aire', 
    unit: 'ppm', 
    icon: 'Shield', 
    color: 'emerald',
    name: 'Calidad Aire (MQ135)',
    description: 'Detección de amoníaco, alcohol, benceno, humo y CO2.',
    safeMax: 150,
    warningMax: 300
  }
};

export const THRESHOLDS = {
  mq4: { safe: 100, warning: 200, danger: 500 },
  mq7: { safe: 20, warning: 50, danger: 100 },
  mq135: { safe: 50, warning: 150, danger: 300 }
};

export function getSensorStatus(value: number, sensorType: string): AirQualityLevel {
  const threshold = THRESHOLDS[sensorType as keyof typeof THRESHOLDS];
  if (!threshold) {
    if (value > 400) return 'PELIGRO';
    if (value > 200) return 'PRECAUCION';
    return 'NORMAL';
  }

  if (value >= threshold.danger) return 'PELIGRO';
  if (value >= threshold.warning) return 'PRECAUCION';
  return 'NORMAL';
}
