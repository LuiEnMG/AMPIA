import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Text, useTheme } from 'react-native-paper';
import { useApp } from '../../context/AppContext';

export default function ProductsScreen() {
  const { products, orders, hydrated, removeProduct } = useApp();
  const theme = useTheme();
  const [sort, setSort] = useState('alpha');
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sort === 'date') {
        return new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0);
      }
      return (a.name ?? '').localeCompare(b.name ?? '', 'es-MX', { sensitivity: 'base' });
    });
  }, [products, sort]);
  const confirmRemove = (product) => {
    const pending = orders.filter((order) => order.productId === product.id && order.status !== 'delivered' && order.status !== 'cancelled');
    if (pending.length) {
      Alert.alert(
        'No se puede eliminar',
        `El producto tiene ${pending.length} pedido${pending.length === 1 ? '' : 's'} pendiente${pending.length === 1 ? '' : 's'}. Espera a que finalicen o cancélalos antes de eliminar el producto.`,
      );
      return;
    }
    Alert.alert('Eliminar producto', `¿Eliminar "${product.name}"? Los pedidos terminados conservarán su nombre.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => removeProduct(product.id) },
    ]);
  };
  if (!hydrated) return <View style={styles.center}><Text>Cargando datos locales...</Text></View>;
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>Tus productos</Text>
        <Text style={[styles.subtitle, { color: theme.colors.mutedText }]}>Crea productos y reutilízalos en tus pedidos.</Text>
        <View style={styles.sorts}>
          <Button compact mode={sort === 'alpha' ? 'contained' : 'outlined'} onPress={() => setSort('alpha')}>Orden alfabético</Button>
          <Button compact mode={sort === 'date' ? 'contained' : 'outlined'} onPress={() => setSort('date')}>Fecha de creación</Button>
        </View>
        {!products.length && <Card style={styles.card}><Card.Content><Text>Aún no tienes productos.</Text><Button onPress={() => router.push('/product/new')}>Crear el primero</Button></Card.Content></Card>}
        {sortedProducts.map((product) => (
          <Card key={product.id} style={styles.card}>
            {product.photos?.[0] && <Card.Cover source={{ uri: product.photos[0] }} />}
            <Card.Title title={product.name} subtitle={product.description} />
            <Card.Actions>
              <Button textColor={theme.colors.error} icon="delete-outline" onPress={() => confirmRemove(product)}>Eliminar</Button>
              <Button mode="contained" onPress={() => router.push({ pathname: '/order/new', params: { productId: product.id } })}>Crear pedido</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
      <FAB icon="plus" color={theme.colors.onPrimary} style={[styles.fab, { backgroundColor: theme.colors.primary }]} onPress={() => router.push('/product/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700' },
  subtitle: { marginTop: 4, marginBottom: 16 },
  sorts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  card: { marginBottom: 12 },
  fab: { position: 'absolute', right: 20, bottom: 20 },
});
