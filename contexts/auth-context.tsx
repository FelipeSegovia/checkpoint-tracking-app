import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { login as loginRequest, logout as logoutRequest } from '@/api/auth';
import type { LoginRequest, UserRole } from '@/api/types';
import {
  clearSession,
  loadSession,
  saveSession,
  type StoredSession,
} from '@/lib/auth-storage';

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  role: UserRole | null;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    let active = true;

    loadSession()
      .then((stored) => {
        if (active) setSession(stored);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = async (credentials: LoginRequest) => {
    const response = await loginRequest(credentials);
    const nextSession: StoredSession = {
      accessToken: response.accessToken,
      role: response.role,
    };
    await saveSession(nextSession);
    setSession(nextSession);
  };

  const signOut = async () => {
    // Revoca el token en el backend; si falla (expirado/revocado/red),
    // igual se limpia la sesión local para no bloquear el cierre.
    if (session?.accessToken) {
      try {
        await logoutRequest(session.accessToken);
      } catch {
        // Ignorado a propósito: el logout local debe completarse siempre.
      }
    }
    await clearSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !!session?.accessToken,
        accessToken: session?.accessToken ?? null,
        role: session?.role ?? null,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
