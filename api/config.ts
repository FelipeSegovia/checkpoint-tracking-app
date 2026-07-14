import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Resuelve la base URL del backend.
 * - EXPO_PUBLIC_API_URL si está definida
 * - IP del Metro host en dispositivo físico (Expo Go)
 * - 10.0.2.2 en emulador Android
 * - localhost en simulador iOS / web
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:3000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}
