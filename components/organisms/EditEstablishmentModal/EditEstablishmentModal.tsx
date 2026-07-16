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
  deleteEstablishment,
  getErrorMessage,
  updateEstablishment,
} from "@/api";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/auth-context";
import { borders, colors, spacing, typography } from "@/quarks";

export type EditEstablishmentData = {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
};

type EditEstablishmentModalProps = {
  visible: boolean;
  establishment: EditEstablishmentData | null;
  onClose: () => void;
  onUpdated: () => void;
  onDisabled?: () => void;
};

export function EditEstablishmentModal({
  visible,
  establishment,
  onClose,
  onUpdated,
  onDisabled,
}: EditEstablishmentModalProps) {
  const { accessToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [addressError, setAddressError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  useEffect(() => {
    if (visible && establishment) {
      setName(establishment.name);
      setAddress(establishment.address);
      setNameError(undefined);
      setAddressError(undefined);
      setSubmitError(undefined);
      setIsSubmitting(false);
      setIsDisabling(false);
    }
  }, [visible, establishment]);

  const resetAndClose = useCallback(() => {
    setName("");
    setAddress("");
    setNameError(undefined);
    setAddressError(undefined);
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
    if (!establishment) return;

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
      await updateEstablishment(
        establishment.id,
        { name: trimmedName, address: trimmedAddress },
        { token: accessToken },
      );
      resetAndClose();
      onUpdated();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    accessToken,
    address,
    establishment,
    name,
    onUpdated,
    resetAndClose,
  ]);

  const handleDisable = useCallback(async () => {
    if (!establishment || !accessToken) {
      setSubmitError("Sesión no válida. Vuelve a iniciar sesión.");
      return;
    }

    setSubmitError(undefined);
    setIsDisabling(true);

    try {
      await deleteEstablishment(establishment.id, { token: accessToken });
      resetAndClose();
      onDisabled?.();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsDisabling(false);
    }
  }, [accessToken, establishment, onDisabled, resetAndClose]);

  const isBusy = isSubmitting || isDisabling;
  const hasChanges =
    !!establishment &&
    (name.trim() !== establishment.name ||
      address.trim() !== establishment.address);
  const canSave =
    !!establishment &&
    name.trim().length > 0 &&
    address.trim().length > 0 &&
    hasChanges &&
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
          <Text style={styles.title}>Editar Establecimiento</Text>
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
            editable={!isBusy}
            error={addressError}
            label="Dirección"
            onChangeText={(value) => {
              setAddress(value);
              if (addressError) setAddressError(undefined);
            }}
            onSubmitEditing={() => {
              void handleSave();
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

          {establishment?.isActive ? (
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
                    name="office-building-remove"
                    size={18}
                  />
                  <Text style={styles.disableText}>
                    Deshabilitar Establecimiento
                  </Text>
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
