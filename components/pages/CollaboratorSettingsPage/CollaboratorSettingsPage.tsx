import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage, getMyProfile } from '@/api';
import type { UserResponse } from '@/api/types';
import { ProfileCard } from '@/components/molecules/ProfileCard';
import { useAuth } from '@/contexts/auth-context';
import { borders, colors, spacing, typography } from '@/quarks';

function roleLabel(role: UserResponse['role']): string {
  if (role === 'supervisor') return 'Supervisor';
  if (role === 'admin') return 'Administrador';
  return 'Colaborador';
}

export function CollaboratorSettingsPage() {
  const { accessToken, userId, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!accessToken || !userId) {
      setError('No se pudo identificar la sesión activa.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyProfile({ userId, token: accessToken });
      setProfile(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, spacing.lg),
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
        <Text style={styles.subtitle}>
          Tus datos personales y opciones de sesión.
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Cargando perfil…</Text>
        </View>
      ) : null}

      {!isLoading && error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={loadProfile}
            style={({ pressed }) => [
              styles.retryButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      {!isLoading && profile ? (
        <ProfileCard
          birthdate={profile.birthdate}
          email={profile.email}
          firstName={profile.firstName}
          identityNumber={profile.identityNumber}
          lastName={profile.lastName}
          mobilePhone={profile.mobilePhone}
          roleLabel={roleLabel(profile.role)}
        />
      ) : null}

      <View style={styles.sessionCard}>
        <Pressable
          accessibilityRole="button"
          disabled={isSigningOut}
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed ? styles.pressed : null,
            isSigningOut ? styles.disabled : null,
          ]}
        >
          {isSigningOut ? (
            <ActivityIndicator color={colors.error} size="small" />
          ) : (
            <>
              <Ionicons color={colors.error} name="log-out-outline" size={20} />
              <Text style={styles.signOutText}>Cerrar Sesión</Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  centered: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
    borderCurve: 'continuous',
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thin,
    gap: spacing.md,
    padding: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
  },
  retryButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thin,
    padding: spacing.md,
  },
  signOutButton: {
    alignItems: 'center',
    borderColor: colors.error,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  signOutText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
