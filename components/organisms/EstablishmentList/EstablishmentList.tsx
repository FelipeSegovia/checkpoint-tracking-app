import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { EstablishmentCard } from '@/components/molecules/EstablishmentCard';
import { colors, spacing, typography } from '@/quarks';

export type EstablishmentListItem = {
  id: string;
  name: string;
  checkpointCount: number;
  guardCount: number;
  isActive: boolean;
};

type EstablishmentListProps = {
  data: EstablishmentListItem[];
  isLoading?: boolean;
  errorMessage?: string;
  onPressItem: (id: string) => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  contentContainerStyle?: object;
};

function keyExtractor(item: EstablishmentListItem) {
  return item.id;
}

export function EstablishmentList({
  data,
  isLoading = false,
  errorMessage,
  onPressItem,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
}: EstablishmentListProps) {
  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        {ListHeaderComponent}
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.stateContainer}>
        {ListHeaderComponent}
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      ListEmptyComponent={
        <Text style={styles.emptyText}>No hay establecimientos activos.</Text>
      }
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <EstablishmentCard
          checkpointCount={item.checkpointCount}
          guardCount={item.guardCount}
          id={item.id}
          isActive={item.isActive}
          name={item.name}
          onPress={onPressItem}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  stateContainer: {
    flex: 1,
    gap: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
});
