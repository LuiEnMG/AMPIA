import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Chip, Text, useTheme } from 'react-native-paper';
import { cityById, deliveryDate, formatDate, useApp } from '../../context/AppContext';

const labels = { preparing: 'Preparando', in_transit: 'En tránsito', near_destination: 'Cerca del destino', delivered: 'Entregado' };

export default function OrdersScreen() {
  const { orders, simulatedNow, selectOrder } = useApp();
  const { colors } = useTheme();
  return <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
    <Text variant="headlineSmall" style={styles.title}>Pedidos activos</Text>
    <Text style={[styles.clock, { color: colors.mutedText }]}>Fecha simulada: {formatDate(simulatedNow)}</Text>
    {!orders.length && <Card style={styles.card}><Card.Content><Text>No hay pedidos. Crea uno desde Productos.</Text><Button onPress={() => router.push('/(tabs)/products')}>Ver productos</Button></Card.Content></Card>}
    {orders.map((order) => {
      const destination = cityById(order.destinationCityId);
      return <Card key={order.id} style={styles.card} onPress={() => { selectOrder(order.id); router.push('/(tabs)/map'); }}>
        <Card.Title title={order.productName} subtitle={`Destino: ${destination?.name}`} />
        <Card.Content>
          <Chip icon={order.status === 'delivered' ? 'check' : 'truck'}>{labels[order.status]}</Chip>
          <Text style={styles.detail}>Nodo actual: {cityById(order.currentCityId)?.name}</Text>
          <Text style={styles.detail}>Entrega estimada: {formatDate(deliveryDate(order))}</Text>
        </Card.Content>
      </Card>;
    })}
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontWeight: '700' },
  clock: { marginVertical: 8 },
  card: { marginBottom: 12 },
  detail: { marginTop: 8 },
});
