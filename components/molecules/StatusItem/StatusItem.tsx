import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/quarks';

type StatusItemProps = {
  icon: React.ReactNode;
  label: string;
};

export function StatusItem({ icon, label }: StatusItemProps) {
  return (
    <View style={styles.item}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
});
