import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  deleteCheckpoint,
  getErrorMessage,
  updateCheckpoint,
} from "@/api";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/auth-context";
import { borders, colors, spacing, typography } from "@/quarks";

export type EditCheckpointData = {
  id: string;
  name: string;
  isActive: boolean;
};

type EditCheckpointModalProps = {
  visible: boolean;
  checkpoint: EditCheckpointData | null;
  onClose: () => void;
  onUpdated: () => void;
};

export function EditCheckpointModal({
  visible,
  checkpoint,
  onClose,
  onUpdated,
}: EditCheckpointModalProps) {
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    if (visible && checkpoint) {
      setName(checkpoint.name);
      setNameError(undefined);
      setSubmitError(undefined);
      setIsSubmitting(false);
      setIsDisabling(false);
    }
  }, [visible, checkpoint]);

  const resetAndClose = useCallback(() => {
    setName("");
    setNameError(undefined);
    setSubmitError(undefined);
    setIsSubmitting(false);
    setIsDisabling(false);
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (isSubmitting || isDisabling) return;
    resetAndClose();
  }, [isDisabling, isSubmitting, resetAndClose]);

  const handleSave = useCallback(async () => {
    if (!checkpoint) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("El nombre es obligatorio");
      return;
    }
    if (!accessToken) {
      setSubmitError("Sesión no válida. Vuelve a iniciar sesión.");
      return;
    }

    setNameError(undefined);
    setSubmitError(undefined);
    setIsSubmitting(true);

    try {
      await updateCheckpoint(
        checkpoint.id,
        { name: trimmedName },
        { token: accessToken },
      );
      resetAndClose();
      onUpdated();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [accessToken, checkpoint, name, onUpdated, resetAndClose]);

  const handleDisable = useCallback(async () => {
    if (!checkpoint || !accessToken) {
      setSubmitError("Sesión no válida. Vuelve a iniciar sesión.");
      return;
    }

    setSubmitError(undefined);
    setIsDisabling(true);

    try {
      await deleteCheckpoint(checkpoint.id, { token: accessToken });
      resetAndClose();
      onUpdated();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsDisabling(false);
    }
  }, [accessToken, checkpoint, onUpdated, resetAndClose]);

  const isBusy = isSubmitting || isDisabling;
  const canSave =
    !!checkpoint &&
    name.trim().length > 0 &&
    name.trim() !== checkpoint.name &&
    !isBusy;

  return (
    <Modal
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="formSheet"
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[
          styles.screen,
          {
            paddingBottom: Math.max(insets.bottom, spacing.md),
            paddingTop: spacing.lg,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Editar Punto</Text>
          <Pressable
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
            disabled={isBusy}
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

        <View style={styles.formContent}>
          <FormField
            autoCapitalize="sentences"
            autoCorrect={false}
            editable={!isBusy}
            error={nameError}
            label="Nombre del punto"
            onChangeText={(value) => {
              setName(value);
              if (nameError) setNameError(undefined);
            }}
            onSubmitEditing={() => {
              void handleSave();
            }}
            placeholder="Ej: Entrada principal"
            returnKeyType="done"
            value={name}
          />

          {submitError ? (
            <Text style={styles.submitError}>{submitError}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isBusy}
              onPress={handleClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Button
              disabled={!canSave}
              onPress={() => {
                void handleSave();
              }}
              style={styles.submitButton}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.textOnPrimary} />
              ) : (
                <>
                  <Button.Icon>
                    <MaterialCommunityIcons
                      color={colors.textOnPrimary}
                      name="content-save-outline"
                      size={18}
                    />
                  </Button.Icon>
                  <Button.Text>Guardar</Button.Text>
                </>
              )}
            </Button>
          </View>

          {checkpoint?.isActive ? (
            <Pressable
              accessibilityRole="button"
              disabled={isBusy}
              onPress={() => {
                void handleDisable();
              }}
              style={({ pressed }) => [
                styles.disableButton,
                pressed ? styles.pressed : null,
                isBusy ? styles.disabled : null,
              ]}
            >
              {isDisabling ? (
                <ActivityIndicator color={colors.error} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    color={colors.error}
                    name="map-marker-off"
                    size={18}
                  />
                  <Text style={styles.disableText}>Deshabilitar Punto</Text>
                </>
              )}
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  formContent: {
    gap: spacing.md,
  },
  submitError: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: colors.surfaceBorder,
    borderCurve: "continuous",
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flex: 1,
    justifyContent: "center",
    paddingVertical: spacing.sm + 2,
  },
  cancelText: {
    color: colors.text,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  submitButton: {
    flex: 1,
  },
  disableButton: {
    alignItems: "center",
    borderColor: colors.error,
    borderCurve: "continuous",
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
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
});
