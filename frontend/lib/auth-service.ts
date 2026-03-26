import { Capacitor } from '@capacitor/core';
import { AuthResponse } from './types';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// Inicializar GoogleAuth con tu Client ID real
if (!Capacitor.isNativePlatform()) {
  GoogleAuth.initialize({
    clientId: '669903110693-3f1lt6ci39go17j1hsutaeabrt36utq0.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://biosenseiot-production.up.railway.app';

export class AuthService {
  
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // Disparar el login nativo o web real del plugin
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;
      
      if (!idToken) {
        throw new Error('No se recibió idToken de Google');
      }

      return await this.sendTokenToBackend(idToken);
    } catch (error: any) {
      console.error('Error GoogleAuth Detallado:', error);
      // Extraer código de error de Google para depuración
      const errorCode = error.code || error.message;
      throw new Error(`Google Login Falló (${errorCode})`);
    }
  }

  private static async sendTokenToBackend(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Servidor (${response.status}): ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al iniciar sesión');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  static async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al registrarse');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    GoogleAuth.signOut();
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
