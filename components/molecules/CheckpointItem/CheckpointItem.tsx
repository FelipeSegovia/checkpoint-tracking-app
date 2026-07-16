import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/atoms/StatusBadge';
import { borders, colors, spacing, typography } from '@/quarks';

type CheckpointItemProps = {
  name: string;
  code: string;
  isActive: boolean;
  onPress?: () => void;
};

export const CheckpointItem = memo(function CheckpointItem({
  name,
  code,
  isActive,
  onPress,
}: CheckpointItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
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
    </Pressable>
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
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
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
