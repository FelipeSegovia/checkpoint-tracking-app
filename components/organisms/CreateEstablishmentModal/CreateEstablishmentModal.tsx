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

import { createEstablishment, getErrorMessage } from "@/api";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/auth-context";
import { borders, colors, spacing, typography } from "@/quarks";

type CreateEstablishmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateEstablishmentModal({
  visible,
  onClose,
  onCreated,
}: CreateEstablishmentModalProps) {
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [addressError, setAddressError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    if (visible) {
      setName("");
      setAddress("");
      setNameError(undefined);
      setAddressError(undefined);
      setSubmitError(undefined);
      setIsSubmitting(false);
    }
  }, [visible]);

  const resetAndClose = useCallback(() => {
    setName("");
    setAddress("");
    setNameError(undefined);
    setAddressError(undefined);
    setSubmitError(undefined);
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    resetAndClose();
  }, [isSubmitting, resetAndClose]);

  const handleCreate = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    let hasError = false;

    if (!trimmedName) {
      setNameError("El nombre es obligatorio");
      hasError = true;
    }
    if (!trimmedAddress) {
      setAddressError("La dirección es obligatoria");
      hasError = true;
    }
    if (hasError) return;

    if (!accessToken) {
      setSubmitError("Sesión no válida. Vuelve a iniciar sesión.");
      return;
    }

    setNameError(undefined);
    setAddressError(undefined);
    setSubmitError(undefined);
    setIsSubmitting(true);

    try {
      await createEstablishment(
        { name: trimmedName, address: trimmedAddress },
        { token: accessToken },
      );
      resetAndClose();
      onCreated();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [accessToken, address, name, onCreated, resetAndClose]);

  const canCreate =
    name.trim().length > 0 && address.trim().length > 0 && !isSubmitting;

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
          <Text style={styles.title}>Nuevo Establecimiento</Text>
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

        <View style={styles.formContent}>
          <FormField
            autoCapitalize="sentences"
            autoCorrect={false}
            editable={!isSubmitting}
            error={nameError}
            label="Nombre"
            onChangeText={(value) => {
              setName(value);
              if (nameError) setNameError(undefined);
            }}
            placeholder="Ej: Condominio Los Álamos"
            returnKeyType="next"
            value={name}
          />

          <FormField
            autoCapitalize="sentences"
            autoCorrect={false}
            editable={!isSubmitting}
            error={addressError}
            label="Dirección"
            onChangeText={(value) => {
              setAddress(value);
              if (addressError) setAddressError(undefined);
            }}
            onSubmitEditing={() => {
              void handleCreate();
            }}
            placeholder="Ej: Av. Providencia 1234, Santiago"
            returnKeyType="done"
            value={address}
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
              disabled={!canCreate}
              onPress={() => {
                void handleCreate();
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
                      name="plus"
                      size={18}
                    />
                  </Button.Icon>
                  <Button.Text>Crear</Button.Text>
                </>
              )}
            </Button>
          </View>
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
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
