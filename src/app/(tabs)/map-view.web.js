import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { cityById, formatDate, useApp } from '../../context/AppContext';

export default function MapScreen() {
  const { orders, selectedOrderId, simulatedNow, toggleSimulation, simulationRunning } = useApp();
  const { colors } = useTheme();
  const order = orders.find((item) => item.id === selectedOrderId);
  if (!order) return <View style={[styles.empty, { backgroundColor: colors.background }]}><Text variant="titleMedium">Selecciona un pedido desde Pedidos para consultar su rastreo.</Text></View>;
  if (order.status === 'cancelled') return <View style={[styles.empty, { backgroundColor: colors.background }]}><Text variant="titleMedium">Este pedido fue cancelado y ya no tiene rastreo activo.</Text></View>;
  const cities = (Array.isArray(order.route) ? order.route : []).map(cityById).filter(Boolean);
  const current = cityById(order.currentCityId);
  if (!cities.length || !current) return <View style={[styles.empty, { backgroundColor: colors.background }]}><Text variant="titleMedium">No hay información de ruta disponible para este pedido.</Text></View>;
  return <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
    <Text variant="headlineSmall" style={styles.title}>Rastreo de {order.productName}</Text>
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">Ubicación actual: {current.name}</Text>
        <Text>Reloj simulado: {formatDate(simulatedNow)}</Text>
      </Card.Content>
    </Card>
    <View style={[styles.route, { borderColor: colors.border }]}>
      {cities.map((city, index) => <View key={city.id} style={styles.step}>
        <View style={[styles.marker, city.id === order.currentCityId ? { backgroundColor: colors.currentMarker } : { backgroundColor: colors.primary }]} />
        <Text style={{ color: city.id === order.currentCityId ? colors.primary : colors.text, fontWeight: city.id === order.currentCityId ? '700' : '400' }}>{city.name}</Text>
        {index < cities.length - 1 && <View style={[styles.line, { backgroundColor: colors.primary }]} />}
      </View>)}
    </View>
    <Button mode="contained" onPress={toggleSimulation}>{simulationRunning ? 'Pausar simulación' : 'Reanudar simulación'}</Button>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { marginBottom: 12, fontWeight: '700' },
  card: { marginBottom: 16 },
  route: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 16 },
  step: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12 },
  marker: { width: 14, height: 14, borderRadius: 7 },
  line: { position: 'absolute', left: 6, top: 29, width: 2, height: 30, opacity: 0.65 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
