import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScanResult } from '@/components/molecules/ScanResult';
import { QRScanner } from '@/components/organisms/QRScanner';
import { borders, colors, spacing, typography } from '@/quarks';

type ScanPhase = 'idle' | 'scanning' | 'result';

export function CollaboratorScanPage() {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [scannedPayload, setScannedPayload] = useState<string | null>(null);

  const handleScanned = (payload: string) => {
    setScannedPayload(payload);
    setPhase('result');
  };

  const handleScanAgain = () => {
    setScannedPayload(null);
    setPhase('scanning');
  };

  const handleClose = () => {
    setScannedPayload(null);
    setPhase('idle');
  };

  if (phase === 'scanning') {
    return (
      <QRScanner
        enabled
        onClose={handleClose}
        onScanned={handleScanned}
      />
    );
  }

  if (phase === 'result' && scannedPayload) {
    return (
      <View
        style={[
          styles.screen,
          {
            paddingTop: Math.max(insets.top, spacing.lg),
            paddingBottom: Math.max(insets.bottom, spacing.lg),
          },
        ]}
      >
        <ScanResult
          onClose={handleClose}
          onScanAgain={handleScanAgain}
          payload={scannedPayload}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, spacing.lg),
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Escanear QR</Text>
        <Text style={styles.subtitle}>
          Marca tus puntos de ronda sin salir de la aplicación.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons color={colors.primary} name="qr-code-outline" size={48} />
        </View>
        <Text style={styles.instructions}>
          Ubícate frente al código QR del checkpoint y activa la cámara para
          registrar tu marca.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => setPhase('scanning')}
          style={({ pressed }) => [
            styles.scanButton,
            pressed ? styles.pressed : null,
          ]}
        >
          <Ionicons color={colors.textOnPrimary} name="camera-outline" size={22} />
          <Text style={styles.scanButtonText}>Iniciar escaneo</Text>
        </Pressable>
      </View>
    </View>
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
  },
  content: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
    borderRadius: 40,
    height: 96,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 96,
  },
  instructions: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  scanButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderCurve: 'continuous',
    borderRadius: borders.radius.md,
    boxShadow: `0 0 10px ${colors.glow}`,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    width: '100%',
  },
  scanButtonText: {
    color: colors.textOnPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
