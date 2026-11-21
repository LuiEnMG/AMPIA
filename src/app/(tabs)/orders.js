import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, useTheme } from 'react-native-paper';
import { cityById, deliveryDate, formatDate, useApp } from '../../context/AppContext';

const labels = { preparing: 'Preparando', in_transit: 'En tránsito', near_destination: 'Cerca del destino', delivered: 'Entregado', cancelled: 'Cancelado' };

export default function OrdersScreen() {
  const { orders, products, simulatedNow, selectOrder, cancelOrder } = useApp();
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all');
  const productIds = useMemo(() => new Set(products.map((product) => product.id)), [products]);
  const filteredOrders = useMemo(() => orders.filter((order) => {
    if (filter === 'existing') return productIds.has(order.productId);
    if (filter === 'missing') return !productIds.has(order.productId);
    return true;
  }), [orders, productIds, filter]);
  const confirmCancel = (order) => {
    if (order.status === 'delivered' || order.status === 'cancelled') return;
    Alert.alert('Cancelar pedido', `¿Cancelar el pedido de ${order.productName}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelOrder(order.id) },
    ]);
  };
  return <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
    <Text variant="headlineSmall" style={styles.title}>Pedidos</Text>
    <Text style={[styles.clock, { color: colors.mutedText }]}>Fecha simulada: {formatDate(simulatedNow)}</Text>
    <View style={styles.filters}>
      {[['all', 'Todos'], ['existing', 'Producto existente'], ['missing', 'Producto inexistente']].map(([value, label]) =>
        <Button key={value} compact mode={filter === value ? 'contained' : 'outlined'} onPress={() => setFilter(value)}>{label}</Button>
      )}
    </View>
    {!orders.length && <Card style={styles.card}><Card.Content><Text>No hay pedidos. Crea uno desde Productos.</Text><Button onPress={() => router.push('/(tabs)/products')}>Ver productos</Button></Card.Content></Card>}
    {orders.length > 0 && filteredOrders.length === 0 && <Card style={styles.card}><Card.Content><Text>No hay pedidos con este filtro.</Text></Card.Content></Card>}
    {filteredOrders.map((order) => {
      const destination = cityById(order.destinationCityId);
      return <Card key={order.id} style={styles.card} onPress={() => { if (order.status !== 'cancelled') { selectOrder(order.id); router.push('/(tabs)/map'); } }}>
        <Card.Title title={order.productName} subtitle={`Destino: ${destination?.name}`} />
        <Card.Content>
          <Chip icon={order.status === 'delivered' ? 'check' : 'truck'}>{labels[order.status]}</Chip>
          <Text style={styles.detail}>Nodo actual: {cityById(order.currentCityId)?.name}</Text>
          <Text style={styles.detail}>Entrega estimada: {formatDate(deliveryDate(order))}</Text>
        </Card.Content>
        {order.status !== 'delivered' && order.status !== 'cancelled' &&
          <Card.Actions><Button textColor={colors.error} onPress={() => confirmCancel(order)}>Cancelar pedido</Button></Card.Actions>}
      </Card>;
    })}
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontWeight: '700' },
  clock: { marginVertical: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  card: { marginBottom: 12 },
  detail: { marginTop: 8 },
});
