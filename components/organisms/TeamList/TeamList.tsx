import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { CollaboratorItem } from '@/components/molecules/CollaboratorItem';
import { colors, spacing, typography } from '@/quarks';

export type TeamListItem = {
  id: string;
  firstName: string;
  lastName: string;
  subtitle: string;
  isActive: boolean;
};

type TeamListProps = {
  data: TeamListItem[];
  isLoading?: boolean;
  errorMessage?: string;
  onPressItem: (id: string) => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  contentContainerStyle?: object;
};

function keyExtractor(item: TeamListItem) {
  return item.id;
}

export function TeamList({
  data,
  isLoading = false,
  errorMessage,
  onPressItem,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
}: TeamListProps) {
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
        <Text style={styles.emptyText}>No hay colaboradores registrados.</Text>
      }
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <CollaboratorItem
          firstName={item.firstName}
          id={item.id}
          lastName={item.lastName}
          onPress={onPressItem}
          subtitle={item.subtitle}
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
