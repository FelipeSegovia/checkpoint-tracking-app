import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  deleteUser,
  getErrorMessage,
  getEstablishmentCollaborators,
  getEstablishments,
  getUserById,
  removeCollaborator,
} from '@/api';
import type { EstablishmentResponse, UserResponse } from '@/api/types';
import { SectionHeader } from '@/components/atoms/SectionHeader';
import { AssignEstablishmentModal } from '@/components/organisms/AssignEstablishmentModal';
import { CollaboratorDetailHeader } from '@/components/organisms/CollaboratorDetailHeader';
import { CollaboratorInfoSection } from '@/components/organisms/CollaboratorInfoSection';
import { useAuth } from '@/contexts/auth-context';
import { borders, colors, spacing, typography } from '@/quarks';

export function CollaboratorDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { back } = useRouter();
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [collaborator, setCollaborator] = useState<UserResponse | null>(null);
  const [assignedEstablishments, setAssignedEstablishments] = useState<
    EstablishmentResponse[]
  >([]);
  const [allEstablishments, setAllEstablishments] = useState<
    EstablishmentResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();

  const loadDetail = useCallback(async () => {
    if (!accessToken || !id) return;

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const [userData, establishments] = await Promise.all([
        getUserById(id, { token: accessToken }),
        getEstablishments({ token: accessToken, isActive: true }),
      ]);

      const collaboratorResults = await Promise.all(
        establishments.map(async (establishment) => {
          const collaborators = await getEstablishmentCollaborators(
            establishment.id,
            { token: accessToken },
          ).catch(() => [] as UserResponse[]);

          const isAssigned = collaborators.some((user) => user.id === id);
          return { establishment, isAssigned };
        }),
      );

      setCollaborator(userData);
      setAllEstablishments(establishments);
      setAssignedEstablishments(
        collaboratorResults
          .filter((result) => result.isAssigned)
          .map((result) => result.establishment),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setCollaborator(null);
      setAssignedEstablishments([]);
      setAllEstablishments([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, id]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const availableEstablishments = allEstablishments.filter(
    (establishment) =>
      !assignedEstablishments.some(
        (assigned) => assigned.id === establishment.id,
      ),
  );

  const handleRemoveAssignment = useCallback(
    async (establishmentId: string) => {
      if (!accessToken || !id) return;

      setActionError(undefined);
      setRemovingId(establishmentId);

      try {
        await removeCollaborator(establishmentId, id, { token: accessToken });
        await loadDetail();
      } catch (error) {
        setActionError(getErrorMessage(error));
      } finally {
        setRemovingId(null);
      }
    },
    [accessToken, id, loadDetail],
  );

  const handleDisable = useCallback(async () => {
    if (!accessToken || !id) return;

    setActionError(undefined);
    setIsDisabling(true);

    try {
      await deleteUser(id, { token: accessToken });
      back();
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setIsDisabling(false);
    }
  }, [accessToken, back, id]);

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (errorMessage || !collaborator) {
    return (
      <View
        style={[
          styles.screen,
          styles.centered,
          {
            paddingTop: Math.max(insets.top, spacing.md),
            paddingBottom: Math.max(insets.bottom, spacing.md),
          },
        ]}
      >
        <Text style={styles.errorText}>
          {errorMessage ?? 'Colaborador no encontrado'}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={back}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, spacing.md),
        },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable
          accessibilityLabel="Volver"
          accessibilityRole="button"
          hitSlop={8}
          onPress={back}
        >
          <Ionicons color={colors.text} name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.brand}>Ronda Segura</Text>
        <View style={styles.topActions}>
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
          <View style={styles.avatar}>
            <Ionicons color={colors.primary} name="person" size={16} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xl },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <CollaboratorDetailHeader
          firstName={collaborator.firstName}
          isActive={collaborator.isActive}
          lastName={collaborator.lastName}
        />

        <CollaboratorInfoSection
          birthdate={collaborator.birthdate}
          email={collaborator.email}
          identityNumber={collaborator.identityNumber}
          mobilePhone={collaborator.mobilePhone}
        />

        <View style={styles.establishmentsSection}>
          <SectionHeader
            actions={
              <Pressable
                accessibilityLabel="Asignar establecimiento"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setIsAssignModalVisible(true)}
              >
                <Ionicons
                  color={colors.primary}
                  name="add-circle-outline"
                  size={22}
                />
              </Pressable>
            }
            title="Establecimientos Asignados"
          />

          {assignedEstablishments.length === 0 ? (
            <Text style={styles.emptyText}>
              Sin establecimiento asignado.
            </Text>
          ) : (
            <View style={styles.establishmentList}>
              {assignedEstablishments.map((establishment) => (
                <View key={establishment.id} style={styles.establishmentRow}>
                  <View style={styles.establishmentInfo}>
                    <Text style={styles.establishmentName}>
                      {establishment.name}
                    </Text>
                    <Text style={styles.establishmentAddress}>
                      {establishment.address}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityLabel="Desasignar establecimiento"
                    accessibilityRole="button"
                    disabled={removingId === establishment.id}
                    hitSlop={8}
                    onPress={() => {
                      void handleRemoveAssignment(establishment.id);
                    }}
                  >
                    {removingId === establishment.id ? (
                      <ActivityIndicator color={colors.error} size="small" />
                    ) : (
                      <MaterialCommunityIcons
                        color={colors.error}
                        name="link-off"
                        size={20}
                      />
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {actionError ? (
          <Text style={styles.actionError}>{actionError}</Text>
        ) : null}

        {collaborator.isActive ? (
          <Pressable
            accessibilityRole="button"
            disabled={isDisabling}
            onPress={() => {
              void handleDisable();
            }}
            style={({ pressed }) => [
              styles.disableButton,
              pressed ? styles.pressed : null,
              isDisabling ? styles.disabled : null,
            ]}
          >
            {isDisabling ? (
              <ActivityIndicator color={colors.error} />
            ) : (
              <>
                <MaterialCommunityIcons
                  color={colors.error}
                  name="account-off-outline"
                  size={18}
                />
                <Text style={styles.disableText}>Desactivar Cuenta</Text>
              </>
            )}
          </Pressable>
        ) : null}
      </ScrollView>

      {id ? (
        <AssignEstablishmentModal
          availableEstablishments={availableEstablishments}
          collaboratorId={id}
          onAssigned={loadDetail}
          onClose={() => setIsAssignModalVisible(false)}
          visible={isAssignModalVisible}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  brand: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.xl,
    borderWidth: borders.width.thin,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  content: {
    gap: spacing.lg,
  },
  establishmentsSection: {
    gap: spacing.sm,
  },
  establishmentList: {
    gap: spacing.xs,
  },
  establishmentRow: {
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
  establishmentInfo: {
    flex: 1,
    gap: 2,
  },
  establishmentName: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  establishmentAddress: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  actionError: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  disableButton: {
    alignItems: 'center',
    borderColor: colors.error,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
  },
  disableText: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  backLink: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  backLinkText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
