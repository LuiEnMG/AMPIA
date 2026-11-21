import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, HelperText, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { CITIES } from '../../data/cities';
import { cityById, useApp } from '../../context/AppContext';

export default function NewOrderScreen() {
  const { productId } = useLocalSearchParams();
  const { products, departure, createOrder } = useApp();
  const { colors } = useTheme();
  const product = useMemo(() => products.find((item) => item.id === productId), [products, productId]);
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [destinationCityId, setDestinationCityId] = useState(CITIES.find((city) => city.id !== departure.cityId)?.id || CITIES[0].id);
  const [error, setError] = useState('');
  const [showDefaultWarning, setShowDefaultWarning] = useState(departure.isDefault);
  const save = () => {
    if (!recipient.trim() || !address.trim()) return setError('El destinatario y la dirección son obligatorios.');
    if (!/^[\w\s#.,-]{8,120}$/u.test(address.trim())) return setError('Usa una dirección de 8 a 120 caracteres.');
    createOrder({ product, recipient: recipient.trim(), address: address.trim(), destinationCityId });
    router.replace('/(tabs)/orders');
  };
  if (!product) return <Text style={styles.content}>Producto no encontrado.</Text>;
  return <ScrollView contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}>
    <Text variant="headlineSmall" style={styles.title}>Pedido de {product.name}</Text>
    <TextInput label="Destinatario" value={recipient} onChangeText={setRecipient} mode="outlined" style={[styles.input, { backgroundColor: colors.surface }]} />
    <TextInput label="Dirección de entrega" value={address} onChangeText={setAddress} mode="outlined" placeholder="Calle, número, colonia" style={[styles.input, { backgroundColor: colors.surface }]} />
    <Text variant="titleMedium" style={styles.label}>Ciudad de destino</Text>
    {CITIES.map((city) => <Button key={city.id} mode={destinationCityId === city.id ? 'contained' : 'outlined'} onPress={() => setDestinationCityId(city.id)} style={styles.city}>{city.name} ({city.state})</Button>)}
    <Text style={[styles.origin, { color: colors.mutedText }]}>Origen: {departure.street}, {cityById(departure.cityId)?.name}</Text>
    <HelperText type="error" visible={Boolean(error)}>{error}</HelperText>
    <Button mode="contained" onPress={save} style={styles.save}>Confirmar pedido</Button>
    <Snackbar visible={showDefaultWarning} onDismiss={() => setShowDefaultWarning(false)} duration={7000}>La dirección de salida sigue siendo la predeterminada. Puedes continuar o modificarla desde Configuración.</Snackbar>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: 20, flexGrow: 1 },
  title: { fontWeight: '700', marginBottom: 20 },
  input: { marginBottom: 12 },
  label: { marginVertical: 8 },
  city: { marginBottom: 8 },
  origin: { marginVertical: 16 },
  save: { marginTop: 8 },
});
