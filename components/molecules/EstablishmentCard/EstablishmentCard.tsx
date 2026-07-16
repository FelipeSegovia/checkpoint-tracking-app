import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/atoms/StatusBadge';
import { borders, colors, spacing, typography } from '@/quarks';

type EstablishmentCardProps = {
  id: string;
  name: string;
  checkpointCount: number;
  guardCount: number;
  isActive: boolean;
  onPress: (id: string) => void;
};

export const EstablishmentCard = memo(function EstablishmentCard({
  id,
  name,
  checkpointCount,
  guardCount,
  isActive,
  onPress,
}: EstablishmentCardProps) {
  const handlePress = () => {
    onPress(id);
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          color={colors.primary}
          name="office-building"
          size={24}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <StatusBadge
            label={isActive ? 'Activo' : 'Inactivo'}
            status={isActive ? 'active' : 'maintenance'}
          />
        </View>

        <View style={styles.metaRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {checkpointCount} Checkpoints
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{guardCount} Guardias</Text>
          </View>
        </View>
      </View>

      <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thin,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  name: {
    color: colors.text,
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    backgroundColor: colors.backgroundElevated,
    borderCurve: 'continuous',
    borderRadius: borders.radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  chipText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
