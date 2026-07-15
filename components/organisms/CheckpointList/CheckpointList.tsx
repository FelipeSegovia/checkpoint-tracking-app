import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/atoms/SectionHeader';
import { CheckpointItem } from '@/components/molecules/CheckpointItem';
import { colors, spacing, typography } from '@/quarks';

export type CheckpointListItem = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
};

type CheckpointListProps = {
  data: CheckpointListItem[];
  emptyMessage?: string;
  onFilterPress?: () => void;
  onExportPress?: () => void;
};

export function CheckpointList({
  data,
  emptyMessage = 'No hay puntos de control.',
  onFilterPress,
  onExportPress,
}: CheckpointListProps) {
  return (
    <View style={styles.container}>
      <SectionHeader
        actions={
          <>
            <Pressable
              accessibilityLabel="Filtrar puntos de control"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onFilterPress}
            >
              <Ionicons color={colors.textMuted} name="filter-outline" size={18} />
            </Pressable>
            <Pressable
              accessibilityLabel="Exportar puntos de control"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onExportPress}
            >
              <Ionicons
                color={colors.textMuted}
                name="download-outline"
                size={18}
              />
            </Pressable>
          </>
        }
        title="Puntos de Control"
      />

      <View style={styles.columnHeaders}>
        <Text style={styles.columnLabel}>Identificador</Text>
        <Text style={styles.columnLabel}>Estado</Text>
      </View>

      <View style={styles.list}>
        {data.length === 0 ? (
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        ) : (
          data.map((item) => (
            <CheckpointItem
              code={item.code}
              isActive={item.isActive}
              key={item.id}
              name={item.name}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  columnHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxs,
  },
  columnLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  list: {
    gap: spacing.xs,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
});
