import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { cityById, formatDate, useApp } from '../../context/AppContext';

export default function MapScreen() {
  const { orders, selectedOrderId, simulatedNow, toggleSimulation, simulationRunning } = useApp();
  const { colors } = useTheme();
  const order = orders.find((item) => item.id === selectedOrderId);
  if (!order) return <View style={[styles.empty, { backgroundColor: colors.background }]}><Text variant="titleMedium">Selecciona un pedido desde Pedidos para consultar su rastreo.</Text></View>;
  const cities = order.route.map(cityById).filter(Boolean);
  const current = cityById(order.currentCityId);
  const coordinates = cities.map(({ latitude, longitude }) => ({ latitude, longitude }));
  return <View style={[styles.container, { backgroundColor: colors.background }]}>
    <MapView style={styles.map} initialRegion={{ latitude: current.latitude, longitude: current.longitude, latitudeDelta: 10, longitudeDelta: 10 }}>
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
  map: { flex: 1 },
  panel: { position: 'absolute', left: 12, right: 12, bottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
