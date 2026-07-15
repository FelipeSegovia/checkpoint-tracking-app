import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { borders, colors, spacing, typography } from '@/quarks';

export function SettingsPage() {
  const { signOut, role } = useAuth();
  const insets = useSafeAreaInsets();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Al limpiar la sesión, el guard de app/(tabs)/_layout.tsx
      // redirige automáticamente al login. No navegar aquí también,
      // o ambas navegaciones entran en conflicto (loop de updates).
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, spacing.lg),
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
        <Text style={styles.subtitle}>
          Preferencias de cuenta y sesión.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sessionRow}>
          <View style={styles.iconBox}>
            <Ionicons color={colors.primary} name="person-outline" size={20} />
          </View>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionLabel}>Sesión activa</Text>
            <Text style={styles.sessionRole}>
              {role === 'supervisor'
                ? 'Supervisor'
                : role === 'admin'
                  ? 'Administrador'
                  : 'Colaborador'}
            </Text>
          </View>
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
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
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thin,
    gap: spacing.md,
    padding: spacing.md,
  },
  sessionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  sessionInfo: {
    flex: 1,
    gap: 2,
  },
  sessionLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  sessionRole: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
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
