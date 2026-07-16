import { StyleSheet, Text, View } from 'react-native';

import { borders, colors, spacing, typography } from '@/quarks';

type StatusBadgeVariant = 'active' | 'maintenance' | 'inactive';

type StatusBadgeProps = {
  status: StatusBadgeVariant;
  label: string;
};

const variantStyles: Record<
  StatusBadgeVariant,
  { container: object; text: object }
> = {
  active: {
    container: {
      backgroundColor: colors.primary,
    },
    text: {
      color: colors.textOnPrimary,
    },
  },
  maintenance: {
    container: {
      backgroundColor: colors.backgroundElevated,
      borderColor: colors.surfaceBorder,
      borderWidth: borders.width.thin,
    },
    text: {
      color: colors.textSecondary,
    },
  },
  inactive: {
    container: {
      backgroundColor: colors.status,
    },
    text: {
      color: colors.text,
    },
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const variant = variantStyles[status];

  return (
    <View style={[styles.badge, variant.container]}>
      <Text style={[styles.label, variant.text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderCurve: 'continuous',
    borderRadius: borders.radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
});
