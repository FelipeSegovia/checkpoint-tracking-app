import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
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

import { createCheckpoint, getErrorMessage } from "@/api";
import type { CheckpointResponse } from "@/api/types";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/auth-context";
import { borders, colors, spacing, typography } from "@/quarks";

type CreateCheckpointModalProps = {
  visible: boolean;
  establishmentId: string;
  onClose: () => void;
  onCreated: () => void;
};

function shortenQrCode(qrPayload: string): string {
  return `QR-${qrPayload.slice(0, 8).toUpperCase()}`;
}

export function CreateCheckpointModal({
  visible,
  establishmentId,
  onClose,
  onCreated,
}: CreateCheckpointModalProps) {
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCheckpoint, setCreatedCheckpoint] =
    useState<CheckpointResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const resetState = useCallback(() => {
    setName("");
    setNameError(undefined);
    setIsSubmitting(false);
    setCreatedCheckpoint(null);
    setSubmitError(undefined);
  }, []);

  const handleClose = useCallback(() => {
    const wasCreated = createdCheckpoint !== null;
    resetState();
    onClose();
    if (wasCreated) {
      onCreated();
    }
  }, [createdCheckpoint, onClose, onCreated, resetState]);

  const handleSubmit = useCallback(async () => {
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
      const checkpoint = await createCheckpoint(
        { name: trimmedName, establishmentId },
        { token: accessToken },
      );
      setCreatedCheckpoint(checkpoint);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [accessToken, establishmentId, name]);

  const canSubmit = name.trim().length > 0 && !isSubmitting;

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
          <Text style={styles.title}>
            {createdCheckpoint ? "Punto creado" : "Nuevo Punto"}
          </Text>
          <Pressable
            accessibilityLabel="Cerrar"
            accessibilityRole="button"
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

        {createdCheckpoint ? (
          <View style={styles.successContent}>
            <Text style={styles.successName}>{createdCheckpoint.name}</Text>
            <Text style={styles.successCode}>
              {shortenQrCode(createdCheckpoint.qrPayload)}
            </Text>

            <View style={styles.qrFrame}>
              <Image
                accessibilityLabel={`Código QR de ${createdCheckpoint.name}`}
                contentFit="contain"
                source={{ uri: createdCheckpoint.qrCodeBase64 }}
                style={styles.qrImage}
              />
            </View>

            <Text style={styles.qrHint}>
              Escanea o imprime este código QR para marcar el punto de control.
            </Text>

            <Button onPress={handleClose}>
              <Button.Text>Listo</Button.Text>
            </Button>
          </View>
        ) : (
          <View style={styles.formContent}>
            <FormField
              autoCapitalize="sentences"
              autoCorrect={false}
              editable={!isSubmitting}
              error={nameError}
              label="Nombre del punto"
              onChangeText={(value) => {
                setName(value);
                if (nameError) setNameError(undefined);
              }}
              onSubmitEditing={() => {
                void handleSubmit();
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
                disabled={isSubmitting}
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>

              <Button
                disabled={!canSubmit}
                onPress={() => {
                  void handleSubmit();
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
                        name="map-marker-plus"
                        size={18}
                      />
                    </Button.Icon>
                    <Button.Text>Crear Punto</Button.Text>
                  </>
                )}
              </Button>
            </View>
          </View>
        )}
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
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  successContent: {
    alignItems: "center",
    gap: spacing.md,
  },
  successName: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
  },
  successCode: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
  qrFrame: {
    backgroundColor: "#ffffff",
    borderCurve: "continuous",
    borderRadius: borders.radius.lg,
    padding: spacing.md,
  },
  qrImage: {
    height: 220,
    width: 220,
  },
  qrHint: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    textAlign: "center",
  },
});
