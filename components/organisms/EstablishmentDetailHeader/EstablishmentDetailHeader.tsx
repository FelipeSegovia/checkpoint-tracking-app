import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { borders, colors, spacing, typography } from '@/quarks';

type EstablishmentDetailHeaderProps = {
  name: string;
  address: string;
  onEdit?: () => void;
  onNewCheckpoint?: () => void;
};

export function EstablishmentDetailHeader({
  name,
  address,
  onEdit,
  onNewCheckpoint,
}: EstablishmentDetailHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Establecimiento</Text>
      <Text style={styles.name}>{name}</Text>

      <View style={styles.addressRow}>
        <Ionicons color={colors.primary} name="location-outline" size={16} />
        <Text style={styles.address}>{address}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          style={({ pressed }) => [
            styles.editButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Ionicons color={colors.text} name="pencil" size={16} />
          <Text style={styles.editText}>Editar</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onNewCheckpoint}
          style={({ pressed }) => [
            styles.newButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <MaterialCommunityIcons
            color={colors.textOnPrimary}
            name="map-marker-plus"
            size={16}
          />
          <Text style={styles.newText}>Nuevo Punto</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  name: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  addressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  address: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: typography.fontSize.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    alignItems: 'center',
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  editText: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  newButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    boxShadow: `0 0 10px ${colors.glow}`,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  newText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
