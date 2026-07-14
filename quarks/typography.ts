export const typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 20,
    xl: 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.3,
    normal: 0,
    wide: 1.2,
    wider: 2,
  },
} as const;
