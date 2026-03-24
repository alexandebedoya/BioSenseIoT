import { Capacitor } from '@capacitor/core';
import { AuthResponse, GoogleUser } from './types';

// NOTA: Se asume que el desarrollador instala @codetrix-studio/capacitor-google-auth para el login nativo
// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class AuthService {
  
  /**
   * Realiza el login con Google dependiendo de la plataforma.
   * En Capacitor usa el plugin nativo, en Web usa la API de Google standard.
   */
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      let idToken: string;

      if (Capacitor.isNativePlatform()) {
        // Implementación para Android/iOS usando Capacitor Google Auth
        // const googleUser = await GoogleAuth.signIn();
        // idToken = googleUser.authentication.idToken;
        
        // Mock para demostración (debe ser reemplazado por el código comentado arriba)
        idToken = 'MOCK_GOOGLE_ID_TOKEN';
      } else {
        // Implementación para Web
        // Aquí se usaría @react-oauth/google o la SDK directa de Google
        idToken = 'MOCK_WEB_GOOGLE_ID_TOKEN';
      }

      return await this.sendTokenToBackend(idToken);
    } catch (error) {
      console.error('Error en el login de Google:', error);
      throw new Error('Error al iniciar sesión con Google');
    }
  }

  /**
   * Envía el idToken al backend de Spring Boot WebFlux para validación e intercambio por JWT.
   */
  private static async sendTokenToBackend(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error en la autenticación del backend');
    }

    const data: AuthResponse = await response.json();
    
    // Guardar el token de forma segura (localStorage para web, SecureStorage para nativo)
    localStorage.setItem('auth_token', data.token);
    
    return data;
  }

  /**
   * Obtiene el token guardado.
   */
  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Cierra la sesión borrando el token.
   */
  static logout(): void {
    localStorage.removeItem('auth_token');
    if (Capacitor.isNativePlatform()) {
      // GoogleAuth.signOut();
    }
  }

  /**
   * Determina si el usuario está autenticado.
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
