import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CollaboratorItem } from '@/components/molecules/CollaboratorItem';
import { borders, colors, spacing, typography } from '@/quarks';

export type CollaboratorListItem = {
  id: string;
  firstName: string;
  lastName: string;
  subtitle: string;
};

type CollaboratorListProps = {
  data: CollaboratorListItem[];
  emptyMessage?: string;
  onAddPress?: () => void;
  onManagePress?: () => void;
};

export function CollaboratorList({
  data,
  emptyMessage = 'No hay colaboradores asignados.',
  onAddPress,
  onManagePress,
}: CollaboratorListProps) {
  return (
    <View style={styles.container}>
      <SectionHeader
        actions={
          <Pressable
            accessibilityLabel="Agregar colaborador"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onAddPress}
          >
            <Ionicons color={colors.primary} name="person-add-outline" size={18} />
          </Pressable>
        }
        title="Colaboradores Asignados"
      />

      <View style={styles.list}>
        {data.length === 0 ? (
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        ) : (
          data.map((item) => (
            <CollaboratorItem
              firstName={item.firstName}
              key={item.id}
              lastName={item.lastName}
              subtitle={item.subtitle}
            />
          ))
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onManagePress}
        style={({ pressed }) => [
          styles.manageButton,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text style={styles.manageText}>Gestionar Equipo Completo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.xs,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  manageButton: {
    alignItems: 'center',
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
  },
  manageText: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.88,
  },
});
