import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getCheckpoints,
  getErrorMessage,
  getEstablishmentById,
  getEstablishmentCollaborators,
} from "@/api";
import type {
  CheckpointResponse,
  EstablishmentResponse,
  UserResponse,
} from "@/api/types";
import { StatCard } from "@/components/atoms/StatCard";
import {
  CheckpointList,
  type CheckpointListItem,
} from "@/components/organisms/CheckpointList";
import {
  CollaboratorList,
  type CollaboratorListItem,
} from "@/components/organisms/CollaboratorList";
import { CreateCheckpointModal } from "@/components/organisms/CreateCheckpointModal";
import { EditCheckpointModal } from "@/components/organisms/EditCheckpointModal";
import { EditEstablishmentModal } from "@/components/organisms/EditEstablishmentModal";
import { EstablishmentDetailHeader } from "@/components/organisms/EstablishmentDetailHeader";
import { useAuth } from "@/contexts/auth-context";
import { borders, colors, spacing, typography } from "@/quarks";

function padCount(value: number): string {
  return String(value).padStart(2, "0");
}

function shortenQrCode(qrPayload: string): string {
  return `QR-${qrPayload.slice(0, 8).toUpperCase()}`;
}

export function EstablishmentDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { back } = useRouter();
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [establishment, setEstablishment] =
    useState<EstablishmentResponse | null>(null);
  const [checkpoints, setCheckpoints] = useState<CheckpointListItem[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorListItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<
    string | null
  >(null);

  const loadDetail = useCallback(async () => {
    if (!accessToken || !id) return;

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const [establishmentData, checkpointData, collaboratorData] =
        await Promise.all([
          getEstablishmentById(id, { token: accessToken }),
          getCheckpoints({ token: accessToken, establishmentId: id }),
          getEstablishmentCollaborators(id, { token: accessToken }),
        ]);

      setEstablishment(establishmentData);
      setCheckpoints(
        checkpointData.map((checkpoint: CheckpointResponse) => ({
          id: checkpoint.id,
          name: checkpoint.name,
          code: shortenQrCode(checkpoint.qrPayload),
          isActive: checkpoint.isActive,
        })),
      );
      setCollaborators(
        collaboratorData.map((user: UserResponse) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          subtitle: user.isActive
            ? "Asignado al establecimiento"
            : "Fuera de servicio",
        })),
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setEstablishment(null);
      setCheckpoints([]);
      setCollaborators([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, id]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const selectedCheckpoint =
    selectedCheckpointId === null
      ? null
      : (checkpoints.find((item) => item.id === selectedCheckpointId) ?? null);

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (errorMessage || !establishment) {
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
          {errorMessage ?? "Establecimiento no encontrado"}
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
        <EstablishmentDetailHeader
          address={establishment.address}
          name={establishment.name}
          onEdit={() => setIsEditModalVisible(true)}
          onNewCheckpoint={() => setIsCreateModalVisible(true)}
        />

        <View style={styles.statsRow}>
          <StatCard
            icon={
              <MaterialCommunityIcons
                color={colors.primary}
                name="map-marker-check"
                size={24}
              />
            }
            label="Checkpoints Totales"
            value={padCount(checkpoints.length)}
          />
          <StatCard
            icon={
              <Ionicons color={colors.primary} name="time-outline" size={24} />
            }
            label="Rondas Hoy"
            value="-- / --"
          />
        </View>
        <Text style={styles.roundsHint}>
          Cumplimiento de rondas disponible cuando el endpoint esté listo.
        </Text>

        <CheckpointList
          data={checkpoints}
          onItemPress={setSelectedCheckpointId}
        />
        <CollaboratorList data={collaborators} />
      </ScrollView>

      {id ? (
        <CreateCheckpointModal
          establishmentId={id}
          onClose={() => setIsCreateModalVisible(false)}
          onCreated={loadDetail}
          visible={isCreateModalVisible}
        />
      ) : null}

      <EditEstablishmentModal
        establishment={{
          id: establishment.id,
          name: establishment.name,
          address: establishment.address,
          isActive: establishment.isActive,
        }}
        onClose={() => setIsEditModalVisible(false)}
        onDisabled={back}
        onUpdated={loadDetail}
        visible={isEditModalVisible}
      />

      <EditCheckpointModal
        checkpoint={
          selectedCheckpoint
            ? {
                id: selectedCheckpoint.id,
                name: selectedCheckpoint.name,
                isActive: selectedCheckpoint.isActive,
              }
            : null
        }
        onClose={() => setSelectedCheckpointId(null)}
        onUpdated={loadDetail}
        visible={selectedCheckpoint !== null}
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
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  brand: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  topActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: "continuous",
    borderRadius: borders.radius.xl,
    borderWidth: borders.width.thin,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  content: {
    gap: spacing.lg,
  },
  liveCard: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: "continuous",
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thin,
    gap: spacing.sm,
    padding: spacing.md,
  },
  liveLabel: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
  },
  livePreview: {
    alignItems: "center",
    backgroundColor: colors.backgroundElevated,
    borderCurve: "continuous",
    borderRadius: borders.radius.md,
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 140,
  },
  liveHint: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  roundsHint: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    marginTop: -spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    textAlign: "center",
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
