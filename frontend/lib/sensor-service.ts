import { DiagnosticResponse, Alert, HistoricalDataPoint } from './types';

const API_BASE_URL = 'https://biosenseiot-production.up.railway.app/api';

export function generateAlerts(): Alert[] {
  return [
    {
      id: '1',
      sensor: 'MQ7',
      type: 'warning',
      message: 'Nivel de CO ligeramente elevado en Sala',
      value: 35,
      timestamp: new Date().toISOString(),
      resolved: false
    }
  ];
}

export function generateHistoricalData(hours: number = 24): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      timestamp: time.toISOString(),
      mq4: 0.1 + Math.random() * 0.2,
      mq7: 0.05 + Math.random() * 0.1,
      mq135: 0.15 + Math.random() * 0.1
    });
  }
  return data;
}

export function calculateStats(data: HistoricalDataPoint[]): any {
  return {
    mq4: { avg: 0.15, max: 0.3, min: 0.1, trend: 'stable' },
    mq7: { avg: 0.08, max: 0.15, min: 0.05, trend: 'up' },
    mq135: { avg: 0.2, max: 0.3, min: 0.15, trend: 'down' },
    avgMq4: 0.15,
    avgMq7: 0.08,
    maxMq4: 0.3,
    maxMq7: 0.15
  };
}

export function getRecommendations(data: any): any[] {
  return ["Ventilar la zona", "Revisar sensores"];
}

export class SensorService {
  static async getLatestDiagnostic(token: string): Promise<DiagnosticResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/diagnostics/latest`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching latest diagnostic:', error);
      throw error;
    }
  }

  static getOfflineMock(): DiagnosticResponse {
    return {
      diagnosticText: "Calidad del aire aceptable.",
      severity: "LOW",
      recommendation: "Ventilar la zona.",
      timestamp: new Date().toISOString(),
      mq4: 0.12,
      mq7: 0.05,
      mq135: 0.22
    };
  }
}
