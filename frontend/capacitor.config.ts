import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.biosense.iot',
  appName: 'BioSense IoT',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '669903110693-3f1lt6ci39go17j1hsutaeabrt36utq0.apps.googleusercontent.com',
      forceCodeForRefreshToken: false,
    },
  },
};

export default config;
