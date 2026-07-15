import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/atoms/StatusBadge';
import { borders, colors, spacing, typography } from '@/quarks';

type CheckpointItemProps = {
  name: string;
  code: string;
  isActive: boolean;
};

export const CheckpointItem = memo(function CheckpointItem({
  name,
  code,
  isActive,
}: CheckpointItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          color={colors.primary}
          name="map-marker-radius"
          size={20}
        />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.code}>
          {code}
        </Text>
      </View>

      <StatusBadge
        label={isActive ? 'Active' : 'Inactive'}
        status={isActive ? 'active' : 'inactive'}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
    borderRadius: borders.radius.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  code: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
});
