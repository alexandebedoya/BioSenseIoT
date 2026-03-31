export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DiagnosticResponse {
  diagnosticText: string;
  severity: Severity;
  recommendation: string;
  timestamp: string;
  mq4: number;   // CH4/Gas Natural
  mq7: number;   // CO
  mq135: number; // Air Quality
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

export const SENSOR_INFO: Record<string, { label: string; unit: string; icon: string; color: string }> = {
  mq4: { label: 'Metano', unit: 'ppm', icon: 'Wind', color: 'orange' },
  mq7: { label: 'Monóxido', unit: 'ppm', icon: 'Activity', color: 'red' },
  mq135: { label: 'Calidad Aire', unit: 'ppm', icon: 'Shield', color: 'emerald' }
};

export function getSensorStatus(value: number, sensorType: string): { label: string; color: string } {
  // Lógica simplificada para evitar errores
  if (value > 400) return { label: 'PELIGRO', color: 'text-red-500' };
  if (value > 200) return { label: 'ALERTA', color: 'text-amber-500' };
  return { label: 'NORMAL', color: 'text-emerald-500' };
}

export const THRESHOLDS = {
  mq4: { warning: 200, danger: 500 },
  mq7: { warning: 50, danger: 100 },
  mq135: { warning: 150, danger: 300 }
};
