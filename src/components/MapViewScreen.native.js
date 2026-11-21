import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { cityById, formatDate, useApp } from '../context/AppContext';

export default function MapViewScreen() {
  const { orders, selectedOrderId, simulatedNow, toggleSimulation, simulationRunning } = useApp();
  const { colors } = useTheme();
  const order = orders.find((item) => item.id === selectedOrderId);
  if (!order) return <View style={[styles.empty, { backgroundColor: colors.background }]}><Text variant="titleMedium">Selecciona un pedido desde Pedidos para consultar su rastreo.</Text></View>;
  if (order.status === 'cancelled') return <View style={[styles.empty, { backgroundColor: colors.background }]}><Text variant="titleMedium">Este pedido fue cancelado y ya no tiene rastreo activo.</Text></View>;
  const cities = (Array.isArray(order.route) ? order.route : []).map(cityById).filter(Boolean);
  const current = cityById(order.currentCityId);
  const hasValidCoordinates = cities.every((city) =>
    Number.isFinite(city.latitude) && Number.isFinite(city.longitude)
  ) && current && Number.isFinite(current.latitude) && Number.isFinite(current.longitude);
  if (!cities.length || !hasValidCoordinates) return <View style={[styles.empty, { backgroundColor: colors.background }]}><Text variant="titleMedium">No hay información de ruta disponible para este pedido.</Text></View>;
  const coordinates = cities.map(({ latitude, longitude }) => ({ latitude, longitude }));
  return <View style={[styles.container, { backgroundColor: colors.background }]}>
    <MapView
      key={`${order.id}-${current.id}`}
      style={styles.map}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      mapType="standard"
      initialRegion={{ latitude: current.latitude, longitude: current.longitude, latitudeDelta: 8, longitudeDelta: 8 }}
    >
      <Polyline coordinates={coordinates} strokeColor={colors.primary} strokeWidth={4} />
      {cities.map((city, index) => <Marker key={city.id} coordinate={city} title={city.name} description={index === 0 ? 'Origen' : index === cities.length - 1 ? 'Destino' : 'Nodo de ruta'} pinColor={city.id === order.currentCityId ? colors.currentMarker : colors.primary} />)}
    </MapView>
    <Card style={[styles.panel, { backgroundColor: colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium">{order.productName}</Text>
        <Text>Ubicación actual: {current.name}</Text>
        <Text>Reloj simulado: {formatDate(simulatedNow)}</Text>
        <Text>Ruta: {cities.map((city) => city.name).join(' → ')}</Text>
        <Button mode="contained" onPress={toggleSimulation}>{simulationRunning ? 'Pausar simulación' : 'Reanudar simulación'}</Button>
      </Card.Content>
    </Card>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, minHeight: 240 },
  panel: { position: 'absolute', left: 12, right: 12, bottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
