import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { UserRole } from '@/api/types';

const TOKEN_KEY = 'ronda_segura_access_token';
const ROLE_KEY = 'ronda_segura_user_role';

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export type StoredSession = {
  accessToken: string;
  role: UserRole;
};

export async function saveSession(session: StoredSession): Promise<void> {
  await setItem(TOKEN_KEY, session.accessToken);
  await setItem(ROLE_KEY, session.role);
}

export async function loadSession(): Promise<StoredSession | null> {
  const accessToken = await getItem(TOKEN_KEY);
  const role = (await getItem(ROLE_KEY)) as UserRole | null;

  if (!accessToken || !role) return null;
  return { accessToken, role };
}

export async function clearSession(): Promise<void> {
  await deleteItem(TOKEN_KEY);
  await deleteItem(ROLE_KEY);
}
