import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { darkColors, lightColors } from './colors';

// Estilos comunes (úsalos en lugar de repetir números en las pantallas).
export const fonts = { titleWeight: '700', brandWeight: '800' };
export const radius = { sm: 8, md: 12, lg: 16 };

function buildTheme(base, c, dark) {
  return {
    ...base,
    dark,
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: c.onPrimary,
      background: c.background,
      onBackground: c.text,
      surface: c.surface,
      onSurface: c.text,
      onSurfaceVariant: c.mutedText,
      outline: c.border,
      error: c.error,
      // Evita el tinte automático de Paper: las tarjetas usan el color `surface`.
      elevation: { level0: 'transparent', level1: c.surface, level2: c.surface, level3: c.surface, level4: c.surface, level5: c.surface },
      // Claves propias, accesibles con useTheme().colors.*
      text: c.text,
      mutedText: c.mutedText,
      border: c.border,
      success: c.success,
      warning: c.warning,
      currentMarker: c.currentMarker,
    },
  };
}

export const lightTheme = buildTheme(MD3LightTheme, lightColors, false);
export const darkTheme = buildTheme(MD3DarkTheme, darkColors, true);
export const themes = { light: lightTheme, dark: darkTheme };
