import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { fonts } from '../theme';

export const APP_NAME = 'Envion';
// Reemplaza este archivo por tu logo real (mismo nombre, o cambia el require).
const logo = require('../../assets/envion-logo.png');

export default function AppHeader() {
  const { colors } = useTheme();
  return <View style={styles.row}>
    <Image source={logo} style={styles.logo} resizeMode="contain" />
    <Text variant="titleLarge" style={{ color: colors.primary, fontWeight: fonts.brandWeight }}>{APP_NAME}</Text>
  </View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 32, height: 32 },
});
