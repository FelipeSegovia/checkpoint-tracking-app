import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getCheckpoints,
  getErrorMessage,
  getEstablishmentCollaborators,
  getEstablishments,
} from "@/api";
import type { EstablishmentResponse } from "@/api/types";
import {
  EstablishmentList,
  type EstablishmentListItem,
} from "@/components/organisms/EstablishmentList";
import { EstablishmentStats } from "@/components/organisms/EstablishmentStats";
import { useAuth } from "@/contexts/auth-context";
import { borders, colors, spacing, typography } from "@/quarks";

export function EstablishmentsPage() {
  const { push } = useRouter();
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<EstablishmentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [totalCheckpoints, setTotalCheckpoints] = useState(0);
  const [totalGuards, setTotalGuards] = useState(0);

  const loadEstablishments = useCallback(async () => {
    if (!accessToken) return;

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const establishments = await getEstablishments({
        token: accessToken,
        isActive: true,
      });

      const enriched = await Promise.all(
        establishments.map(async (establishment: EstablishmentResponse) => {
          const [checkpoints, collaborators] = await Promise.all([
            getCheckpoints({
              token: accessToken,
              establishmentId: establishment.id,
            }).catch(() => []),
            getEstablishmentCollaborators(establishment.id, {
              token: accessToken,
            }).catch(() => []),
          ]);

          return {
            id: establishment.id,
            name: establishment.name,
            checkpointCount: checkpoints.length,
            guardCount: collaborators.length,
            isActive: establishment.isActive,
          } satisfies EstablishmentListItem;
        }),
      );

      setItems(enriched);
      setTotalCheckpoints(
        enriched.reduce((sum, item) => sum + item.checkpointCount, 0),
      );
      setTotalGuards(enriched.reduce((sum, item) => sum + item.guardCount, 0));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setItems([]);
      setTotalCheckpoints(0);
      setTotalGuards(0);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadEstablishments();
  }, [loadEstablishments]);

  const handlePressItem = useCallback(
    (id: string) => {
      push({
        pathname: "/establishments/[id]",
        params: { id },
      });
    },
    [push],
  );

  const handleCreatePress = () => {
    // Flujo de creación pendiente de pantalla modal/formulario.
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.topBar}>
        <View style={styles.avatar}>
          <Ionicons color={colors.primary} name="person" size={18} />
        </View>
        <Text style={styles.brand}>Checkpoint Tracking</Text>
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
        <Text style={styles.title}>Establecimientos</Text>
        <Text style={styles.subtitle}>
          Supervisión y gestión de infraestructuras críticas, puntos de control
          operativos y despliegue de personal activo.
        </Text>
      </View>

      <EstablishmentStats
        activeCheckpoints={totalCheckpoints}
        guardsOnDuty={totalGuards}
        totalEstablishments={items.length}
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
      <EstablishmentList
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
          accessibilityLabel="Nuevo establecimiento"
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: "continuous",
    borderRadius: borders.radius.xl,
    borderWidth: borders.width.thin,
    height: 36,
    justifyContent: "center",
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
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end",
    position: "absolute",
    right: spacing.md,
  },
  fabLabel: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderCurve: "continuous",
    borderRadius: borders.radius.xl,
    borderWidth: borders.width.thin,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  fabLabelText: {
    color: colors.text,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: "uppercase",
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderCurve: "continuous",
    borderRadius: borders.radius.md,
    boxShadow: `0 0 14px ${colors.glow}`,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
});
