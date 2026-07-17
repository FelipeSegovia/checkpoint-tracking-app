import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { assignCollaborator, getErrorMessage } from '@/api';
import type { EstablishmentResponse } from '@/api/types';
import { useAuth } from '@/contexts/auth-context';
import { borders, colors, spacing, typography } from '@/quarks';

type AssignEstablishmentModalProps = {
  visible: boolean;
  collaboratorId: string;
  availableEstablishments: EstablishmentResponse[];
  onClose: () => void;
  onAssigned: () => void;
};

export function AssignEstablishmentModal({
  visible,
  collaboratorId,
  availableEstablishments,
  onClose,
  onAssigned,
}: AssignEstablishmentModalProps) {
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    if (visible) {
      setSelectedId(null);
      setSubmitError(undefined);
      setIsSubmitting(false);
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    setSelectedId(null);
    setSubmitError(undefined);
    onClose();
  }, [isSubmitting, onClose]);

  const handleAssign = useCallback(async () => {
    if (!selectedId || !accessToken) {
      setSubmitError('Sesión no válida. Vuelve a iniciar sesión.');
      return;
    }

    setSubmitError(undefined);
    setIsSubmitting(true);

    try {
      await assignCollaborator(selectedId, collaboratorId, {
        token: accessToken,
      });
      setSelectedId(null);
      onClose();
      onAssigned();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    accessToken,
    collaboratorId,
    onAssigned,
    onClose,
    selectedId,
  ]);

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="formSheet"
      visible={visible}
    >
      <View
        style={[
          styles.screen,
          {
            paddingBottom: Math.max(insets.bottom, spacing.md),
            paddingTop: spacing.lg,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Asignar Establecimiento</Text>
          <Pressable
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
            disabled={isSubmitting}
            hitSlop={8}
            onPress={handleClose}
          >
            <MaterialCommunityIcons
              color={colors.textSecondary}
              name="close"
              size={24}
            />
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Selecciona un establecimiento disponible para asignar al colaborador.
        </Text>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {availableEstablishments.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay establecimientos disponibles para asignar.
            </Text>
          ) : (
            availableEstablishments.map((establishment) => {
              const isSelected = selectedId === establishment.id;
              return (
                <Pressable
                  key={establishment.id}
                  accessibilityRole="button"
                  disabled={isSubmitting}
                  onPress={() => setSelectedId(establishment.id)}
                  style={({ pressed }) => [
                    styles.item,
                    isSelected ? styles.itemSelected : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <View style={styles.itemContent}>
                    <Text style={styles.itemName}>{establishment.name}</Text>
                    <Text style={styles.itemAddress}>
                      {establishment.address}
                    </Text>
                  </View>
                  {isSelected ? (
                    <MaterialCommunityIcons
                      color={colors.primary}
                      name="check-circle"
                      size={22}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      color={colors.textMuted}
                      name="circle-outline"
                      size={22}
                    />
                  )}
                </Pressable>
              );
            })
          )}
        </ScrollView>

        {submitError ? (
          <Text style={styles.submitError}>{submitError}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleClose}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={!selectedId || isSubmitting}
            onPress={() => {
              void handleAssign();
            }}
            style={({ pressed }) => [
              styles.assignButton,
              !selectedId || isSubmitting ? styles.disabled : null,
              pressed && selectedId ? styles.pressed : null,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.assignText}>Asignar</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  item: {
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
  itemSelected: {
    borderColor: colors.primary,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    color: colors.text,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  itemAddress: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  submitError: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
  },
  cancelText: {
    color: colors.text,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  assignButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
  },
  assignText: {
    color: colors.textOnPrimary,
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
});
