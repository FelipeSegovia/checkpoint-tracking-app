import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borders, colors, spacing, typography } from '@/quarks';

type ScanResultProps = {
  payload: string;
  onScanAgain: () => void;
  onClose: () => void;
};

export function ScanResult({ payload, onScanAgain, onClose }: ScanResultProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons color={colors.primary} name="checkmark-circle" size={48} />
      </View>
      <Text style={styles.title}>Código QR detectado</Text>
      <Text style={styles.subtitle}>
        Se leyó el siguiente identificador del punto de ronda:
      </Text>
      <View style={styles.payloadBox}>
        <Text selectable style={styles.payload}>
          {payload}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onScanAgain}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Ionicons color={colors.textOnPrimary} name="qr-code-outline" size={20} />
        <Text style={styles.primaryText}>Escanear de nuevo</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.secondaryText}>Cerrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  payloadBox: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  payload: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    boxShadow: `0 0 10px ${colors.glow}`,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    width: '100%',
  },
  primaryText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: {
    opacity: 0.85,
  },
});
