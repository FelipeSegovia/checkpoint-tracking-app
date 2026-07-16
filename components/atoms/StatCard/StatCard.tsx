import { StyleSheet, Text, View } from 'react-native';

import { borders, colors, spacing, typography } from '@/quarks';

type StatCardProps = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <View style={styles.card}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flex: 1,
    gap: spacing.xxs,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  icon: {
    opacity: 0.35,
    position: 'absolute',
    right: spacing.xs,
    top: spacing.xs,
  },
  value: {
    color: colors.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
});
