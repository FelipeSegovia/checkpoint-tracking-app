import { StyleSheet, Text, View } from 'react-native';

import { LogoMark } from '@/components/atoms/LogoMark';
import { colors, spacing, typography } from '@/quarks';

export function LoginHeader() {
  return (
    <View style={styles.header}>
      <LogoMark />
      <View style={styles.titles}>
        <Text style={styles.title}>Ronda Segura</Text>
        <Text style={styles.subtitle}>Sistema de Seguridad Táctica</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  titles: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  title: {
    color: colors.primary,
    fontSize: typography.fontSize.lg + 2,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
  },
});
