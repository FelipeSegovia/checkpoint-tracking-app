import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getErrorMessage, getUsers } from '@/api';
import type { UserResponse } from '@/api/types';
import { CreateCollaboratorModal } from '@/components/organisms/CreateCollaboratorModal';
import {
  TeamList,
  type TeamListItem,
} from '@/components/organisms/TeamList';
import { TeamStats } from '@/components/organisms/TeamStats';
import { useAuth } from '@/contexts/auth-context';
import { borders, colors, spacing, typography } from '@/quarks';
import { formatRut } from '@/utils/rut';

export function TeamPage() {
  const { push } = useRouter();
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<TeamListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [activeCount, setActiveCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadCollaborators = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const users = await getUsers({ token: accessToken, isActive: true });
      const collaborators = users.filter(
        (user: UserResponse) => user.role === 'colaborador',
      );

      setItems(
        collaborators.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          subtitle: user.email || formatRut(user.identityNumber),
          isActive: user.isActive,
        })),
      );
      setActiveCount(collaborators.filter((user) => user.isActive).length);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setItems([]);
      setActiveCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadCollaborators();
  }, [loadCollaborators]);

  const handlePressItem = useCallback(
    (id: string) => {
      push({
        pathname: '/collaborators/[id]',
        params: { id },
      });
    },
    [push],
  );

  const handleCreatePress = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCreateClose = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleCreated = useCallback(() => {
    void loadCollaborators();
  }, [loadCollaborators]);

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.topBar}>
        <View style={styles.avatar}>
          <Ionicons color={colors.primary} name="person" size={18} />
        </View>
        <Text style={styles.brand}>Ronda Segura</Text>
        <Pressable
          accessibilityLabel="Notificaciones"
          accessibilityRole="button"
        >
          <Ionicons
            color={colors.textSecondary}
            name="notifications-outline"
            size={22}
          />
        </Pressable>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Equipo</Text>
        <Text style={styles.subtitle}>
          Gestión de colaboradores asignados a tu supervisión, perfiles
          operativos y despliegue en establecimientos.
        </Text>
      </View>

      <TeamStats
        activeCollaborators={activeCount}
        totalCollaborators={items.length}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, spacing.md),
        },
      ]}
    >
      <TeamList
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        data={items}
        errorMessage={errorMessage}
        isLoading={isLoading}
        onPressItem={handlePressItem}
      />

      <View
        style={[
          styles.fabRow,
          { bottom: Math.max(insets.bottom, spacing.md) + spacing.sm },
        ]}
      >
        <Pressable
          accessibilityLabel="Nuevo colaborador"
          accessibilityRole="button"
          onPress={handleCreatePress}
          style={({ pressed }) => [
            styles.fab,
            pressed ? styles.fabPressed : null,
          ]}
        >
          <Ionicons color={colors.textOnPrimary} name="add" size={28} />
        </Pressable>
      </View>

      <CreateCollaboratorModal
        onClose={handleCreateClose}
        onCreated={handleCreated}
        visible={showCreateModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xxxl * 2,
  },
  headerBlock: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.xl,
    borderWidth: borders.width.thin,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  brand: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  titleBlock: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
  },
  fabRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    position: 'absolute',
    right: spacing.md,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    boxShadow: `0 0 14px ${colors.glow}`,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
});
