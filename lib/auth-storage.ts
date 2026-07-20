import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { UserRole } from '@/api/types';
import { decodeJwtPayload } from '@/lib/jwt';

const TOKEN_KEY = 'ronda_segura_access_token';
const ROLE_KEY = 'ronda_segura_user_role';
const USER_ID_KEY = 'ronda_segura_user_id';

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
  userId: string;
};

export async function saveSession(session: StoredSession): Promise<void> {
  await setItem(TOKEN_KEY, session.accessToken);
  await setItem(ROLE_KEY, session.role);
  await setItem(USER_ID_KEY, session.userId);
}

export async function loadSession(): Promise<StoredSession | null> {
  const accessToken = await getItem(TOKEN_KEY);
  const role = (await getItem(ROLE_KEY)) as UserRole | null;
  let userId = await getItem(USER_ID_KEY);

  if (!accessToken || !role) return null;

  // Migración: sesiones antiguas sin userId pueden recuperarlo del JWT.
  if (!userId) {
    try {
      userId = decodeJwtPayload(accessToken).sub;
      await setItem(USER_ID_KEY, userId);
    } catch {
      return null;
    }
  }

  return { accessToken, role, userId };
}

export async function clearSession(): Promise<void> {
  await deleteItem(TOKEN_KEY);
  await deleteItem(ROLE_KEY);
  await deleteItem(USER_ID_KEY);
}
