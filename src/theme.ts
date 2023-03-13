export const theme = {
  fonts: {
    titleLarge: {
      lineHeight: 28,
      fontSize: 22,
      letterSpacing: 0,
      weight: '400',
    },
    labelLarge: {
      lineHeight: 20,
      fontSize: 14,
      letterSpacing: 0.1,
      weight: '500',
    },
    bodyLarge: {
      lineHeight: 24,
      fontSize: 16,
      letterSpacing: 0.5,
      weight: '400',
    },
    bodyMedium: {
      lineHeight: 20,
      fontSize: 14,
      letterSpacing: 0.25,
      weight: '400',
    },
    headlineSmall: {
      lineHeight: 32,
      fontSize: 24,
      letterSpacing: 0,
      weight: '400',
    },
    headlineLarge: {
      lineHeight: 40,
      fontSize: 32,
      letterSpacing: 0,
      weight: '400',
    },
  },
  spaces: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  colors: {
    background: '#fbfaff',
    onBackground: '#09052e',
    surface: '#fbfaff',
    onSurface: '#09052e',
    surfaceVariant: '#e5e6e6',
    onSurfaceVariant: '#4c4d4d',
    outline: '#7d8282',
    outlineVariant: '#cbcdcd',
    primary: '#32309e',
    onPrimary: '#ffffff',
    primaryContainer: '#d8d8f3',
    onPrimaryContainer: '#0c0b25',
    secondary: '#00b2ce',
    onSecondary: '#ffffff',
    secondaryContainer: '#ccf8ff',
    onSecondaryContainer: '#002c33',
    error: '#c10e0b',
    onError: '#ffffff',
    errorContainer: '#fcd0cf',
    onErrorContainer: '#300403',
    surfaceTint: {
      elevationTwo: '#ecebf8',
    },
    opacity: (percent: number) => ({
      primary: `rgba(50, 48, 158, ${percent})`,
      onSurface: `rgba(9, 5, 46, ${percent})`,
    }),
  },
  modal: {
    borderRadius: 28,
    minWidth: 280,
    maxWidth: 560,
    padding: 24,
    margin: 24,
  },
} as const;
