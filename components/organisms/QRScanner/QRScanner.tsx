import Ionicons from '@expo/vector-icons/Ionicons';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { borders, colors, spacing, typography } from '@/quarks';

type QRScannerProps = {
  onScanned: (payload: string) => void;
  onClose: () => void;
  enabled?: boolean;
};

export function QRScanner({
  onScanned,
  onClose,
  enabled = true,
}: QRScannerProps) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (!enabled || !result.data) return;
    onScanned(result.data);
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Verificando permisos de cámara…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <View style={styles.iconBox}>
          <Ionicons color={colors.primary} name="camera-outline" size={36} />
        </View>
        <Text style={styles.title}>Permiso de cámara requerido</Text>
        <Text style={styles.message}>
          Necesitamos acceso a la cámara para escanear los códigos QR de tus
          puntos de ronda.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={requestPermission}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.primaryText}>Permitir cámara</Text>
        </Pressable>

        {!permission.canAskAgain ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => Linking.openSettings()}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.secondaryText}>Abrir ajustes del dispositivo</Text>
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.secondaryText}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.cameraRoot}>
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        facing="back"
        onBarcodeScanned={enabled ? handleBarcodeScanned : undefined}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        pointerEvents="box-none"
        style={[
          styles.overlay,
          {
            paddingTop: Math.max(insets.top, spacing.md),
            paddingBottom: Math.max(insets.bottom, spacing.md),
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Ionicons color={colors.text} name="close" size={24} />
        </Pressable>

        <View style={styles.frameContainer}>
          <View style={styles.frame} />
          <Text style={styles.hint}>
            Apunta al código QR del punto de ronda
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraRoot: {
    backgroundColor: colors.background,
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(13, 17, 23, 0.7)',
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  frameContainer: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
  },
  frame: {
    borderColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.lg,
    borderWidth: 2,
    boxShadow: `0 0 16px ${colors.glow}`,
    height: 240,
    width: 240,
  },
  hint: {
    backgroundColor: 'rgba(13, 17, 23, 0.75)',
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    textAlign: 'center',
  },
  centered: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
    borderRadius: 28,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    boxShadow: `0 0 10px ${colors.glow}`,
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    width: '100%',
  },
  primaryText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.surfaceBorder,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    borderWidth: borders.width.thin,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: {
    opacity: 0.85,
  },
});
