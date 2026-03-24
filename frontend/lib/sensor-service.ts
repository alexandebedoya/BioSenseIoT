import { DiagnosticResponse } from './types';

const API_BASE_URL = 'https://biosense-iot-production.up.railway.app/api';

export class SensorService {
  /**
   * Obtiene el último diagnóstico de IA consolidado desde el backend en Railway.
   * @param token El JWT obtenido tras el login con Google.
   */
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

  // Mock de datos para desarrollo offline si es necesario
  static getOfflineMock(): DiagnosticResponse {
    return {
      diagnosticText: "Calidad del aire aceptable para humanos, pero sensible para mascotas braquicéfalas.",
      severity: "MEDIUM",
      recommendation: "Ventilar la zona durante 15 minutos.",
      timestamp: new Date().toISOString(),
      mq4: 0.12,
      mq7: 0.05,
      mq135: 0.22
    };
  }
}
